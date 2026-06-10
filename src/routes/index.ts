import { Router } from "express";
import authRoutes from "./auth.routes";
import profileRoutes from "./profile.routes";
import studentRoutes from "./student.routes";
import adminRoutes from "./admin.routes";
import marketingRoutes from "./marketing.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/student", studentRoutes);
router.use("/admin", adminRoutes);
router.use("/", marketingRoutes); // mounts blog, marketing contact, newsletter, and checkout at root of router

export default router;
