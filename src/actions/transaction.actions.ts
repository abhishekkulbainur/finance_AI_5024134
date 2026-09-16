'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/mongoose';
import { Transaction } from '@/models';
import { accountingService } from '@/services/accounting.service';

export async function createTransaction(data: any) {
  try {
    await dbConnect();
    const transaction = new Transaction(data);
    await transaction.save();
    
    // If completed immediately, process accounting
    if (transaction.status === 'COMPLETED') {
      await accountingService.processTransaction(transaction._id.toString());
    }

    revalidatePath('/dashboard');
    revalidatePath('/transactions');
    return { success: true, id: transaction._id.toString() };
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    return { success: false, error: error.message };
  }
}

export async function getTransactions() {
  try {
    await dbConnect();
    const transactions = await Transaction.find()
      .populate('categoryId')
      .populate('departmentId')
      .populate('vendorId')
      .populate('customerId')
      .sort({ date: -1 })
      .lean();
    
    // Convert ObjectIds and Dates for client components
    return JSON.parse(JSON.stringify(transactions));
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

export async function approveTransaction(transactionId: string) {
  try {
    await dbConnect();
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) throw new Error('Transaction not found');
    
    transaction.status = 'COMPLETED';
    await transaction.save();
    
    await accountingService.processTransaction(transaction._id.toString());
    
    revalidatePath('/transactions');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTransaction(transactionId: string) {
  try {
    await dbConnect();
    const transaction = await Transaction.findByIdAndDelete(transactionId);
    if (!transaction) throw new Error('Transaction not found');
    
    if (transaction.status === 'COMPLETED') {
       // Reverse accounting
       // await accountingService.reverseTransaction(transaction._id.toString());
    }

    revalidatePath('/transactions');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

