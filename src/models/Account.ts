import mongoose, { Schema, Document } from 'mongoose';

export interface IAccount extends Document {
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  balance: number;
}

const AccountSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'], required: true },
  balance: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Account || mongoose.model<IAccount>('Account', AccountSchema);
