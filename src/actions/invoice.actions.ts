'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/mongoose';
import { Invoice, Transaction } from '@/models';
import { aiService } from '@/services/ai.service';
import { accountingService } from '@/services/accounting.service';

export async function uploadInvoice(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Process with AI Service
    const extractedData = await aiService.extractInvoice(buffer, file.name);

    await dbConnect();
    
    // Save to Database
    const invoice = new Invoice({
      invoiceNumber: extractedData.invoiceNumber,
      type: 'PAYABLE',
      date: extractedData.invoiceDate,
      dueDate: extractedData.dueDate,
      subtotal: extractedData.subtotal,
      taxAmount: extractedData.totalTax,
      totalAmount: extractedData.grandTotal,
      status: 'PENDING',
      description: `AI Extracted from ${file.name}`,
      items: extractedData.lineItems,
      aiConfidence: extractedData.confidenceScore,
      validationStatus: 'PENDING_REVIEW'
    });

    await invoice.save();
    
    revalidatePath('/invoices');
    return { success: true, invoice: JSON.parse(JSON.stringify(invoice)) };
  } catch (error: any) {
    console.error('Error uploading invoice:', error);
    return { success: false, error: error.message };
  }
}

export async function approveInvoice(invoiceId: string) {
  try {
    await dbConnect();
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) throw new Error('Invoice not found');
    
    invoice.status = 'PAID';
    invoice.validationStatus = 'APPROVED';
    await invoice.save();

    // Auto-create Transaction and Journal Entry
    const aiCategory = await aiService.categorizeTransaction(invoice.description || '', invoice.totalAmount);
    
    // Try to find the category in DB, if not use a generic one (skipped for brevity)
    
    const transaction = new Transaction({
      date: new Date(),
      type: 'EXPENSE',
      amount: invoice.totalAmount,
      description: `Payment for Invoice ${invoice.invoiceNumber}`,
      status: 'COMPLETED',
      invoiceId: invoice._id,
    });
    
    await transaction.save();
    
    // Trigger accounting engine
    await accountingService.processTransaction(transaction._id.toString());
    
    revalidatePath('/invoices');
    revalidatePath('/transactions');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
