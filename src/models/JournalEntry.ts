import mongoose, { Schema, Document } from 'mongoose';

export interface IJournalLine {
  accountId: mongoose.Types.ObjectId;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
}

export interface IJournalEntry extends Document {
  voucherNumber: string;
  date: Date;
  description?: string;
  transactionId?: mongoose.Types.ObjectId;
  lines: IJournalLine[];
}

const JournalLineSchema: Schema = new Schema({
  accountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  type: { type: String, enum: ['DEBIT', 'CREDIT'], required: true },
  amount: { type: Number, required: true },
});

const JournalEntrySchema: Schema = new Schema({
  voucherNumber: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
  transactionId: { type: Schema.Types.ObjectId, ref: 'Transaction' },
  lines: [JournalLineSchema],
}, { timestamps: true });

export default mongoose.models.JournalEntry || mongoose.model<IJournalEntry>('JournalEntry', JournalEntrySchema);
