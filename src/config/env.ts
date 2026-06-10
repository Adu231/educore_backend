import dotenv from "dotenv";

dotenv.config();

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Environment variable ${name} is required but was not defined.`
    );
  }

  return value;
}

export const env = {
  PORT: parseInt(process.env.PORT || "5000", 10),

  // MongoDB Atlas connection string from Render Environment Variables
  MONGODB_URI: getEnv("MONGODB_URI"),

  // JWT Secret from Render Environment Variables
  JWT_SECRET: getEnv("JWT_SECRET"),

  NODE_ENV: process.env.NODE_ENV || "development",
};