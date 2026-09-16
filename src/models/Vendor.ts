import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  gstin?: string;
  address?: string;
  totalTransactions: number;
  totalAmount: number;
}

const VendorSchema: Schema = new Schema({
  name: { type: String, required: true },
  company: { type: String },
  email: { type: String },
  phone: { type: String },
  gstin: { type: String },
  address: { type: String },
  totalTransactions: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Vendor || mongoose.model<IVendor>('Vendor', VendorSchema);
