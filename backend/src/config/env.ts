import dotenv from "dotenv";

dotenv.config();

const parseOrigins = (value?: string) =>
  value
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  corsOrigins: parseOrigins(process.env.CORS_ORIGIN ?? process.env.CORS_ORIGINS),
};

export const isProduction = env.nodeEnv === "production";
