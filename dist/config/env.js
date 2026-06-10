"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function getEnv(name, fallback) {
    const value = process.env[name] || fallback;
    if (!value) {
        throw new Error(`Environment variable ${name} is required but was not defined.`);
    }
    return value;
}
exports.env = {
    PORT: parseInt(getEnv("PORT", "5000"), 10),
    MONGODB_URI: getEnv("MONGODB_URI", "mongodb://localhost:27017/educore"),
    JWT_SECRET: getEnv("JWT_SECRET", "supersecure_randomsecretkey_educore2026"),
    NODE_ENV: process.env.NODE_ENV || "development",
};
