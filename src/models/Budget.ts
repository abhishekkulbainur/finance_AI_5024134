import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
  budgetName: string;
  period: string;
  allocatedAmount: number;
  spentAmount: number;
  departmentId?: mongoose.Types.ObjectId;
  categoryId?: mongoose.Types.ObjectId;
}

const BudgetSchema: Schema = new Schema({
  budgetName: { type: String, required: true },
  period: { type: String, required: true },
  allocatedAmount: { type: Number, required: true },
  spentAmount: { type: Number, default: 0 },
  departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
  categoryId: { type: Schema.Types.ObjectId, ref: 'TransactionCategory' },
}, { timestamps: true });

export default mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);
