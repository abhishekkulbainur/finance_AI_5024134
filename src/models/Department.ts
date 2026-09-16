import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
  name: string;
  managerName?: string;
  budget: number;
  totalExpenses: number;
  revenueContribution: number;
}

const DepartmentSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  managerName: { type: String },
  budget: { type: Number, default: 0 },
  totalExpenses: { type: Number, default: 0 },
  revenueContribution: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Department || mongoose.model<IDepartment>('Department', DepartmentSchema);
