"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPost = void 0;
const mongoose_1 = require("mongoose");
const blogPostSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: [{ type: String, required: true }],
    author: { type: String, required: true },
    date: { type: String, required: true },
    category: { type: String, required: true },
    readTime: { type: String, required: true },
    image: { type: String, required: true },
    featured: { type: Boolean, default: false }
}, {
    timestamps: true
});
exports.BlogPost = (0, mongoose_1.model)("BlogPost", blogPostSchema);
