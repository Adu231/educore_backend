"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notice = void 0;
const mongoose_1 = require("mongoose");
const noticeSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    priority: { type: String, required: true, enum: ["high", "medium", "low"], default: "medium" },
    content: { type: String, required: true },
    published: { type: Boolean, default: false }
}, {
    timestamps: true
});
exports.Notice = (0, mongoose_1.model)("Notice", noticeSchema);
