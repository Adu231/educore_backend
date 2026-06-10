import dotenv from "dotenv";

dotenv.config();

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] || fallback;
  if (!value) {
    throw new Error(`Environment variable ${name} is required but was not defined.`);
  }
  return value;
}

export const env = {
  PORT: parseInt(getEnv("PORT", "5000"), 10),
  MONGODB_URI: getEnv("MONGODB_URI", "mongodb://localhost:27017/educore"),
  JWT_SECRET: getEnv("JWT_SECRET", "supersecure_randomsecretkey_educore2026"),
  NODE_ENV: process.env.NODE_ENV || "development",
};
