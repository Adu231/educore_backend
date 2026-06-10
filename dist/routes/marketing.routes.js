"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const marketing_controller_1 = require("../controllers/marketing.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Publicly Accessible Endpoints
router.post("/marketing/contact", marketing_controller_1.MarketingController.recordContactInquiry);
router.post("/marketing/newsletter", marketing_controller_1.MarketingController.subscribeNewsletter);
router.get("/blog/posts", marketing_controller_1.MarketingController.getBlogPosts);
router.get("/blog/posts/:id", marketing_controller_1.MarketingController.getBlogPostDetails);
// Protected Endpoint (requires auth context)
router.post("/payment/checkout", auth_middleware_1.authMiddleware, marketing_controller_1.MarketingController.checkoutPaymentTransaction);
exports.default = router;
