import mongoose, { Schema, Document } from 'mongoose';

export interface IReconciliation {
  status: 'MATCHED' | 'UNMATCHED' | 'POTENTIAL_MATCH' | 'DUPLICATE';
  aiSuggestedMatchId?: mongoose.Types.ObjectId;
}

export interface IBankTransaction extends Document {
  date: Date;
  description: string;
  reference?: string;
  amount: number;
  reconciliation?: IReconciliation;
}

const ReconciliationSchema: Schema = new Schema({
  status: { type: String, enum: ['MATCHED', 'UNMATCHED', 'POTENTIAL_MATCH', 'DUPLICATE'], default: 'UNMATCHED' },
  aiSuggestedMatchId: { type: Schema.Types.ObjectId, ref: 'Transaction' },
}, { timestamps: true });

const BankTransactionSchema: Schema = new Schema({
  date: { type: Date, required: true },
  description: { type: String, required: true },
  reference: { type: String },
  amount: { type: Number, required: true },
  reconciliation: ReconciliationSchema,
}, { timestamps: true });

export default mongoose.models.BankTransaction || mongoose.model<IBankTransaction>('BankTransaction', BankTransactionSchema);
