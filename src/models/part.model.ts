import mongoose, { Schema, Document } from 'mongoose';

export enum PartType {
  RAW = 'RAW',
  ASSEMBLED = 'ASSEMBLED'
}

interface IConstituent {
  id: string;
  quantity: number;
}

export interface IPart extends Document {
  name: string;
  type: PartType;
  quantity: number;
  parts?: IConstituent[];
}

const ConstituentSchema = new Schema<IConstituent>({
  id: { type: String, required: true },
  quantity: { type: Number, required: true }
});

const PartSchema = new Schema<IPart>({
  name: { type: String, required: true },
  type: { type: String, enum: Object.values(PartType), required: true },
  quantity: { type: Number, default: 0 },
  parts: [ConstituentSchema]
});

export const Part = mongoose.model<IPart>('Part', PartSchema);