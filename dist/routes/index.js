"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const profile_routes_1 = __importDefault(require("./profile.routes"));
const student_routes_1 = __importDefault(require("./student.routes"));
const admin_routes_1 = __importDefault(require("./admin.routes"));
const marketing_routes_1 = __importDefault(require("./marketing.routes"));
const router = (0, express_1.Router)();
router.use("/auth", auth_routes_1.default);
router.use("/profile", profile_routes_1.default);
router.use("/student", student_routes_1.default);
router.use("/admin", admin_routes_1.default);
router.use("/", marketing_routes_1.default); // mounts blog, marketing contact, newsletter, and checkout at root of router
exports.default = router;
