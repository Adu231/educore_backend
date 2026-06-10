"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Newsletter = void 0;
const mongoose_1 = require("mongoose");
const newsletterSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true }
}, {
    timestamps: true
});
exports.Newsletter = (0, mongoose_1.model)("Newsletter", newsletterSchema);
