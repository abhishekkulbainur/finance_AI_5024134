"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createManualInvoice } from "@/actions/invoice.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText } from "lucide-react";

export function InvoiceManualForm() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const subtotal = Number(formData.get("subtotal"));
    const taxAmount = Number(formData.get("taxAmount"));

    startTransition(async () => {
      const data = {
        invoiceNumber: formData.get("invoiceNumber") as string,
        date: new Date(formData.get("date") as string),
        description: formData.get("description") as string,
        subtotal,
        taxAmount,
      };

      const result = await createManualInvoice(data);

      if (result.success) {
        toast.success("Invoice added manually");
        setOpen(false);
      } else {
        toast.error(result.error || "Failed to create invoice");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-white border border-zinc-200 text-zinc-900 shadow-sm hover:bg-zinc-100 h-9 px-4 py-2 mt-4 w-full max-w-[200px] mx-auto">
        <FileText className="h-4 w-4" />
        Enter Manually
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manual Invoice Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input id="invoiceNumber" name="invoiceNumber" placeholder="INV-2023-001" required disabled={isPending} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" required disabled={isPending} defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Vendor / Description</Label>
            <Input id="description" name="description" placeholder="AWS Cloud Services" required disabled={isPending} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subtotal">Subtotal (₹)</Label>
              <Input id="subtotal" name="subtotal" type="number" step="0.01" min="0" placeholder="100.00" required disabled={isPending} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxAmount">Tax (₹)</Label>
              <Input id="taxAmount" name="taxAmount" type="number" step="0.01" min="0" placeholder="18.00" required disabled={isPending} />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Invoice"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
