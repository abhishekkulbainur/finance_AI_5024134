import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  gstin?: string;
  address?: string;
  revenue: number;
  outstandingAmount: number;
}

const CustomerSchema: Schema = new Schema({
  name: { type: String, required: true },
  company: { type: String },
  email: { type: String },
  phone: { type: String },
  gstin: { type: String },
  address: { type: String },
  revenue: { type: Number, default: 0 },
  outstandingAmount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);
