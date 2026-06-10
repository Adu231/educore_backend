import { Router } from "express";
import { MarketingController } from "../controllers/marketing.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Publicly Accessible Endpoints
router.post("/marketing/contact", MarketingController.recordContactInquiry);
router.post("/marketing/newsletter", MarketingController.subscribeNewsletter);
router.get("/blog/posts", MarketingController.getBlogPosts);
router.get("/blog/posts/:id", MarketingController.getBlogPostDetails);

// Protected Endpoint (requires auth context)
router.post("/payment/checkout", authMiddleware, MarketingController.checkoutPaymentTransaction);

export default router;
