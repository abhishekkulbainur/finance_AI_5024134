import mongoose, { Schema, Document } from 'mongoose';

export interface IAIInsight extends Document {
  title: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  explanation: string;
  supportingMetrics?: string;
  recommendedAction?: string;
}

const AIInsightSchema: Schema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'LOW' },
  explanation: { type: String, required: true },
  supportingMetrics: { type: String },
  recommendedAction: { type: String },
}, { timestamps: true });

export const AIInsight = mongoose.models.AIInsight || mongoose.model<IAIInsight>('AIInsight', AIInsightSchema);

export interface IAIAnomaly extends Document {
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  transactionId?: mongoose.Types.ObjectId;
  reason: string;
  expectedValue?: string;
  actualValue?: string;
  recommendedAction?: string;
}

const AIAnomalySchema: Schema = new Schema({
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], required: true },
  transactionId: { type: Schema.Types.ObjectId, ref: 'Transaction' },
  reason: { type: String, required: true },
  expectedValue: { type: String },
  actualValue: { type: String },
  recommendedAction: { type: String },
}, { timestamps: true });

export const AIAnomaly = mongoose.models.AIAnomaly || mongoose.model<IAIAnomaly>('AIAnomaly', AIAnomalySchema);
