import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.put("/update", authMiddleware, AuthController.updateProfile);
router.patch("/avatar", authMiddleware, AuthController.updateAvatar);
router.put("/change-password", authMiddleware, AuthController.changePassword);

export default router;
