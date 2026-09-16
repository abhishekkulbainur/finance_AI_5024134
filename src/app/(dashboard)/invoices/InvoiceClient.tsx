"use client";

import { useState, useTransition, useRef } from "react";
import { toast } from "sonner";
import { uploadInvoice, approveInvoice } from "@/actions/invoice.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Check, Search, FileText } from "lucide-react";
import { InvoiceManualForm } from "@/components/invoices/InvoiceManualForm";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export const InvoiceClient = ({ initialData }: { initialData: any[] }) => {
  const [isUploading, startUpload] = useTransition();
  const [isApproving, startApprove] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    startUpload(async () => {
      const result = await uploadInvoice(formData);
      if (result.success) {
        toast.success("Invoice processed successfully.");
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        toast.error(result.error || "Failed to process invoice");
      }
    });
  };

  const handleApprove = (id: string) => {
    startApprove(async () => {
      await approveInvoice(id);
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex flex-col items-center justify-center p-12 border border-dashed border-zinc-300 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
          />
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border border-zinc-200 shadow-sm mb-4 group-hover:scale-105 transition-transform">
            <Upload className="h-5 w-5 text-zinc-600" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900 mb-1">
            {isUploading ? 'Extracting document data...' : 'Upload an invoice'}
          </h3>
          <p className="text-xs text-zinc-500 text-center max-w-sm">
            Drag and drop your PDF or image here, or click to browse. The AI will automatically extract the data.
          </p>
        </div>
        <InvoiceManualForm />
      </div>

      <Card className="shadow-none border-zinc-200">
        <CardHeader className="border-b border-zinc-100 pb-4 mb-0">
          <CardTitle className="text-base font-semibold text-zinc-900">Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b-zinc-200">
                <TableHead className="font-medium text-zinc-500 text-xs uppercase tracking-wider h-10">Invoice #</TableHead>
                <TableHead className="font-medium text-zinc-500 text-xs uppercase tracking-wider h-10">Date</TableHead>
                <TableHead className="font-medium text-zinc-500 text-xs uppercase tracking-wider h-10">Vendor</TableHead>
                <TableHead className="font-medium text-zinc-500 text-xs uppercase tracking-wider h-10 text-right">Amount</TableHead>
                <TableHead className="font-medium text-zinc-500 text-xs uppercase tracking-wider h-10">Extraction</TableHead>
                <TableHead className="font-medium text-zinc-500 text-xs uppercase tracking-wider h-10">Status</TableHead>
                <TableHead className="font-medium text-zinc-500 text-xs uppercase tracking-wider h-10 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialData.map((invoice) => (
                <TableRow key={invoice._id} className="border-b-zinc-100">
                  <TableCell className="text-sm font-medium text-zinc-900">{invoice.invoiceNumber}</TableCell>
                  <TableCell className="text-sm text-zinc-500">
                    {new Date(invoice.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="text-sm text-zinc-900">{invoice.vendorId?.name || 'Unknown Vendor'}</TableCell>
                  <TableCell className="text-sm font-medium text-zinc-900 text-right">
                    ₹{invoice.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    {invoice.aiConfidence ? (
                      <div className="flex items-center space-x-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${invoice.aiConfidence > 0.8 ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                        <span className="text-xs font-medium text-zinc-600">
                          {Math.round(invoice.aiConfidence * 100)}% Match
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-400">Manual</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${invoice.status === 'PAID' ? 'bg-zinc-400' : 'bg-amber-400'}`} />
                      <span className="text-xs font-medium text-zinc-600 capitalize">
                        {invoice.status.toLowerCase()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {invoice.status === 'PENDING' ? (
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-8 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100">
                          <Search className="h-3.5 w-3.5 mr-1" />
                          Review
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleApprove(invoice._id)}
                          disabled={isApproving}
                          className="h-8 text-xs font-medium text-zinc-900 hover:bg-zinc-100"
                        >
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Approve
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-400 pr-4">Processed</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              
              {initialData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-zinc-500 text-sm">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="h-8 w-8 mb-3 text-zinc-300" />
                      <p>No invoices uploaded yet.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
