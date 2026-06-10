"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    planName: { type: String, required: true },
    billingCycle: { type: String, required: true },
    amountPaid: { type: Number, required: true },
    transactionId: { type: String, required: true, unique: true },
    timestamp: { type: Date, default: Date.now },
    userId: { type: String, required: true, ref: "User" }
}, {
    timestamps: true
});
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
