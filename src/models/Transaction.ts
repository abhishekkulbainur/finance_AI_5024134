import mongoose, { Schema, Document } from 'mongoose';

export interface ITransactionCategory extends Document {
  name: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'REFUND';
}

const TransactionCategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, enum: ['INCOME', 'EXPENSE', 'TRANSFER', 'REFUND'], required: true },
});

export const TransactionCategory = mongoose.models.TransactionCategory || mongoose.model<ITransactionCategory>('TransactionCategory', TransactionCategorySchema);

export interface ITransaction extends Document {
  date: Date;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'REFUND';
  amount: number;
  description?: string;
  paymentMethod?: string;
  referenceNumber?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  categoryId?: mongoose.Types.ObjectId;
  accountId?: mongoose.Types.ObjectId;
  departmentId?: mongoose.Types.ObjectId;
  vendorId?: mongoose.Types.ObjectId;
  customerId?: mongoose.Types.ObjectId;
  invoiceId?: mongoose.Types.ObjectId;
  createdBy?: string;
}

const TransactionSchema: Schema = new Schema({
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['INCOME', 'EXPENSE', 'TRANSFER', 'REFUND'], required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  paymentMethod: { type: String },
  referenceNumber: { type: String },
  status: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'], default: 'COMPLETED' },
  categoryId: { type: Schema.Types.ObjectId, ref: 'TransactionCategory' },
  accountId: { type: Schema.Types.ObjectId, ref: 'Account' },
  departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
  invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice' },
  createdBy: { type: String },
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
