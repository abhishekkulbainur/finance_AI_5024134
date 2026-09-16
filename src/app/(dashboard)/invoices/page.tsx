import dbConnect from "@/lib/mongoose";
import { Invoice } from "@/models";
import { InvoiceClient } from "./InvoiceClient";

export const dynamic = 'force-dynamic';

export default async function InvoicesPage() {
  await dbConnect();
  
  const invoices = await Invoice.find()
    .populate('vendorId')
    .sort({ date: -1 })
    .lean();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Invoice Processing</h2>
          <p className="text-muted-foreground">
            Upload invoices to automatically extract data using the AI engine.
          </p>
        </div>
      </div>
      
      <InvoiceClient initialData={JSON.parse(JSON.stringify(invoices))} />
    </div>
  );
}
