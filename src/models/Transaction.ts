import { Schema, model } from "mongoose";

export interface ITransaction {
  planName: string;
  billingCycle: string;
  amountPaid: number;
  transactionId: string;
  timestamp: Date;
  userId: string;
}

const transactionSchema = new Schema<ITransaction>({
  planName: { type: String, required: true },
  billingCycle: { type: String, required: true },
  amountPaid: { type: Number, required: true },
  transactionId: { type: String, required: true, unique: true },
  timestamp: { type: Date, default: Date.now },
  userId: { type: String, required: true, ref: "User" }
}, {
  timestamps: true
});

export const Transaction = model<ITransaction>("Transaction", transactionSchema);
