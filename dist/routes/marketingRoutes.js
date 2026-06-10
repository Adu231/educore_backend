"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ContactMessage_1 = require("../models/ContactMessage");
const Newsletter_1 = require("../models/Newsletter");
const BlogPost_1 = require("../models/BlogPost");
const Transaction_1 = require("../models/Transaction");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Contact Form Message
router.post("/marketing/contact", async (req, res) => {
    const { name, email, subject, message, type } = req.body;
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "Name, email, subject, and message are required." });
    }
    try {
        const newMsg = new ContactMessage_1.ContactMessage({ name, email, subject, message, type });
        await newMsg.save();
        return res.json({ message: "Inquiry received. Thank you for contacting EduCore support." });
    }
    catch (err) {
        return res.status(500).json({ error: "Failed to record contact message." });
    }
});
// Newsletter Subscription
router.post("/marketing/newsletter", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required." });
    }
    try {
        const existing = await Newsletter_1.Newsletter.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.json({ message: "Subscribed successfully!" }); // Treat idempotently
        }
        const newSub = new Newsletter_1.Newsletter({ email });
        await newSub.save();
        return res.json({ message: "Subscribed successfully!" });
    }
    catch (err) {
        return res.status(500).json({ error: "Newsletter registration failed." });
    }
});
// Get Blog Posts
router.get("/blog/posts", async (req, res) => {
    try {
        const posts = await BlogPost_1.BlogPost.find({}).sort({ createdAt: -1 });
        return res.json(posts);
    }
    catch (err) {
        return res.status(500).json({ error: "Failed to fetch blog posts." });
    }
});
// Get Detailed Blog Post Content
router.get("/blog/posts/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const post = await BlogPost_1.BlogPost.findOne({ id });
        if (!post) {
            return res.status(404).json({ error: "Blog post not found." });
        }
        return res.json(post);
    }
    catch (err) {
        return res.status(500).json({ error: "Failed to fetch blog details." });
    }
});
// Payment Plan Checkout Transaction
router.post("/payment/checkout", auth_1.authMiddleware, async (req, res) => {
    const { planName, billingCycle, amountPaid, cardDetails } = req.body;
    if (!planName || !billingCycle || !amountPaid || !cardDetails) {
        return res.status(400).json({ error: "Plan details and billing cycles are required." });
    }
    try {
        const mockTxnId = "TXN_" + Date.now().toString() + Math.floor(Math.random() * 1000).toString();
        const newTxn = new Transaction_1.Transaction({
            planName,
            billingCycle,
            amountPaid,
            transactionId: mockTxnId,
            userId: req.user?.id || "unknown"
        });
        await newTxn.save();
        return res.json({
            message: "Payment verified and processed successfully.",
            transactionId: mockTxnId,
            amountPaid,
            timestamp: newTxn.timestamp
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Checkout payment transaction failed." });
    }
});
exports.default = router;
