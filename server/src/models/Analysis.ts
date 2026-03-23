import mongoose, { Schema, Document } from 'mongoose';

export interface IMedication {
  name: string;
  dosage: string;
  timing: string;
  duration: string;
}

export interface ISideEffect {
  effect: string;
  action: string;
}

export interface IAnalysis extends Document {
  diagnosis: string;
  medications: IMedication[];
  sideEffects: ISideEffect[];
  followUp: string[];
  familySummary: string;
  userId?: mongoose.Types.ObjectId;
  status: 'processing' | 'completed' | 'failed';
  fileType: string;
  fileSize?: number;
  originalText?: string;
  createdAt: Date;
}

const MedicationSchema: Schema = new Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  timing: { type: String, required: true },
  duration: { type: String, required: true },
});

const SideEffectSchema: Schema = new Schema({
  effect: { type: String, required: true },
  action: { type: String, required: true },
});

const AnalysisSchema: Schema = new Schema({
  diagnosis: { type: String, required: true },
  medications: [MedicationSchema],
  sideEffects: [SideEffectSchema],
  followUp: [String],
  familySummary: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['processing', 'completed', 'failed'], default: 'completed' },
  fileType: { type: String, required: true },
  fileSize: { type: Number },
  originalText: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAnalysis>('Analysis', AnalysisSchema);
