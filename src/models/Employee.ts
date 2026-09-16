import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  employeeId: string;
  name: string;
  designation?: string;
  salary: number;
  status: string;
  departmentId?: mongoose.Types.ObjectId;
}

const EmployeeSchema: Schema = new Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  designation: { type: String },
  salary: { type: Number, default: 0 },
  status: { type: String, default: 'ACTIVE' },
  departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
}, { timestamps: true });

export default mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);
