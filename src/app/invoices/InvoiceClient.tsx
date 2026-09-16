"use client";

import { useState, useTransition, useRef } from "react";
import { uploadInvoice, approveInvoice } from "@/actions/invoice.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UploadCloud, CheckCircle2, FileText, Loader2, Search } from "lucide-react";
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
      await uploadInvoice(formData);
      if (fileInputRef.current) fileInputRef.current.value = '';
    });
  };

  const handleApprove = (id: string) => {
    startApprove(async () => {
      await approveInvoice(id);
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-dashed border-2 bg-zinc-50/50">
        <CardContent className="flex flex-col items-center justify-center p-12">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
          />
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
            {isUploading ? <Loader2 className="h-8 w-8 animate-spin" /> : <UploadCloud className="h-8 w-8" />}
          </div>
          <h3 className="text-xl font-semibold mb-2">Upload Invoice for AI Extraction</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm text-center">
            Upload a PDF or image of the invoice. Our AI will automatically extract the line items, taxes, and vendor details.
          </p>
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isUploading ? 'Extracting Data...' : 'Select File'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>AI Confidence</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialData.map((invoice) => (
                <TableRow key={invoice._id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                  <TableCell>{invoice.vendorId?.name || 'Unknown Vendor'}</TableCell>
                  <TableCell className="font-semibold">₹{invoice.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    {invoice.aiConfidence ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-16 bg-zinc-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${invoice.aiConfidence > 0.8 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                            style={{ width: `${invoice.aiConfidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{Math.round(invoice.aiConfidence * 100)}%</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={invoice.status === 'PAID' ? 'default' : 'outline'}
                      className={invoice.status === 'PAID' ? 'bg-emerald-500' : 'text-amber-600 border-amber-200 bg-amber-50'}
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {invoice.status === 'PENDING' ? (
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Search className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleApprove(invoice._id)}
                          disabled={isApproving}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Approve & Pay
                        </Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" disabled>
                        Processed
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              
              {initialData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="h-8 w-8 mb-2 text-zinc-300" />
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
