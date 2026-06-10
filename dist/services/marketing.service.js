"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketingService = void 0;
const ContactMessage_1 = require("../models/ContactMessage");
const Newsletter_1 = require("../models/Newsletter");
const BlogPost_1 = require("../models/BlogPost");
const Transaction_1 = require("../models/Transaction");
const errors_1 = require("../utils/errors");
class MarketingService {
    /**
     * Submit a contact form inquiry
     */
    static async recordContactInquiry(data) {
        const { name, email, subject, message, type } = data;
        if (!name || !email || !subject || !message) {
            throw new errors_1.BadRequestError("Name, email, subject, and message are required.");
        }
        const newMsg = new ContactMessage_1.ContactMessage({ name, email, subject, message, type });
        await newMsg.save();
        return { message: "Inquiry received. Thank you for contacting EduCore support." };
    }
    /**
     * Register a new newsletter subscriber
     */
    static async subscribeNewsletter(email) {
        if (!email) {
            throw new errors_1.BadRequestError("Email is required.");
        }
        const existing = await Newsletter_1.Newsletter.findOne({ email: email.toLowerCase() });
        if (existing) {
            return { message: "Subscribed successfully!" }; // Handle idempotently
        }
        const newSub = new Newsletter_1.Newsletter({ email });
        await newSub.save();
        return { message: "Subscribed successfully!" };
    }
    /**
     * Retrieve all blog posts
     */
    static async getBlogPosts() {
        return BlogPost_1.BlogPost.find({}).sort({ createdAt: -1 });
    }
    /**
     * Retrieve detailed content of a specific blog post
     */
    static async getBlogPostDetails(id) {
        const post = await BlogPost_1.BlogPost.findOne({ id });
        if (!post) {
            throw new errors_1.NotFoundError("Blog post not found.");
        }
        return post;
    }
    /**
     * Handle mock plan checkouts and record transaction
     */
    static async checkoutPaymentTransaction(userId, data) {
        const { planName, billingCycle, amountPaid, cardDetails } = data;
        if (!planName || !billingCycle || !amountPaid || !cardDetails) {
            throw new errors_1.BadRequestError("Plan details and billing cycles are required.");
        }
        const mockTxnId = "TXN_" + Date.now().toString() + Math.floor(Math.random() * 1000).toString();
        const newTxn = new Transaction_1.Transaction({
            planName,
            billingCycle,
            amountPaid,
            transactionId: mockTxnId,
            userId: userId || "unknown"
        });
        await newTxn.save();
        return {
            message: "Payment verified and processed successfully.",
            transactionId: mockTxnId,
            amountPaid,
            timestamp: newTxn.timestamp
        };
    }
}
exports.MarketingService = MarketingService;
