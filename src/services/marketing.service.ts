import { ContactMessage } from "../models/ContactMessage";
import { Newsletter } from "../models/Newsletter";
import { BlogPost } from "../models/BlogPost";
import { Transaction } from "../models/Transaction";
import { BadRequestError, NotFoundError } from "../utils/errors";

export class MarketingService {
  /**
   * Submit a contact form inquiry
   */
  static async recordContactInquiry(data: any) {
    const { name, email, subject, message, type } = data;
    if (!name || !email || !subject || !message) {
      throw new BadRequestError("Name, email, subject, and message are required.");
    }

    const newMsg = new ContactMessage({ name, email, subject, message, type });
    await newMsg.save();
    return { message: "Inquiry received. Thank you for contacting EduCore support." };
  }

  /**
   * Register a new newsletter subscriber
   */
  static async subscribeNewsletter(email: string) {
    if (!email) {
      throw new BadRequestError("Email is required.");
    }

    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      return { message: "Subscribed successfully!" }; // Handle idempotently
    }

    const newSub = new Newsletter({ email });
    await newSub.save();
    return { message: "Subscribed successfully!" };
  }

  /**
   * Retrieve all blog posts
   */
  static async getBlogPosts() {
    return BlogPost.find({}).sort({ createdAt: -1 });
  }

  /**
   * Retrieve detailed content of a specific blog post
   */
  static async getBlogPostDetails(id: string) {
    const post = await BlogPost.findOne({ id });
    if (!post) {
      throw new NotFoundError("Blog post not found.");
    }
    return post;
  }

  /**
   * Handle mock plan checkouts and record transaction
   */
  static async checkoutPaymentTransaction(userId: string, data: any) {
    const { planName, billingCycle, amountPaid, cardDetails } = data;
    if (!planName || !billingCycle || !amountPaid || !cardDetails) {
      throw new BadRequestError("Plan details and billing cycles are required.");
    }

    const mockTxnId = "TXN_" + Date.now().toString() + Math.floor(Math.random() * 1000).toString();
    const newTxn = new Transaction({
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
