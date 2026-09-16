import mongoose, { Schema, Document } from 'mongoose';

export interface IAsset extends Document {
  assetName: string;
  assetId: string;
  category: string;
  purchaseDate: Date;
  purchaseValue: number;
  currentValue: number;
  location?: string;
  status: string;
  departmentId?: mongoose.Types.ObjectId;
}

const AssetSchema: Schema = new Schema({
  assetName: { type: String, required: true },
  assetId: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  purchaseDate: { type: Date, required: true },
  purchaseValue: { type: Number, required: true },
  currentValue: { type: Number, required: true },
  location: { type: String },
  status: { type: String, default: 'ACTIVE' },
  departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
}, { timestamps: true });

export default mongoose.models.Asset || mongoose.model<IAsset>('Asset', AssetSchema);
