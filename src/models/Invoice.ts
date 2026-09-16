import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  type: 'RECEIVABLE' | 'PAYABLE';
  date: Date;
  dueDate: Date;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'PARTIALLY_PAID';
  paymentMethod?: string;
  description?: string;
  vendorId?: mongoose.Types.ObjectId;
  customerId?: mongoose.Types.ObjectId;
  items: IInvoiceItem[];
  aiConfidence?: number;
  validationStatus?: string;
}

const InvoiceItemSchema: Schema = new Schema({
  description: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  unitPrice: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
});

const InvoiceSchema: Schema = new Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  type: { type: String, enum: ['RECEIVABLE', 'PAYABLE'], required: true },
  date: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  subtotal: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['DRAFT', 'PENDING', 'PAID', 'OVERDUE', 'PARTIALLY_PAID'], default: 'PENDING' },
  paymentMethod: { type: String },
  description: { type: String },
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
  items: [InvoiceItemSchema],
  aiConfidence: { type: Number },
  validationStatus: { type: String },
}, { timestamps: true });

export default mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);
