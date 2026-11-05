import dotenv from "dotenv";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);

const envKeys = [
  // SMTP / Nodemailer
  "EMAIL_USER",
  "EMAIL_PASS",
  "EMAIL_FROM",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASS",
  // EmailJS fallback
  "EMAILJS_SERVICE_ID",
  "EMAILJS_PUBLIC_KEY",
  "EMAILJS_PRIVATE_KEY",
  "EMAILJS_TEMPLATE_OWNER",
  "EMAILJS_TEMPLATE_USER",
  // App
  "OWNER_EMAIL",
  "PORT",
  "CLIENT_URL",
];

function trimEnv(keys) {
  for (const key of keys) {
    if (typeof process.env[key] === "string") {
      process.env[key] = process.env[key].trim();
    }
  }
}

dotenv.config({ path: path.join(projectRoot, ".env"), override: true });

const localEnv = path.join(projectRoot, ".env.local");
if (existsSync(localEnv)) {
  dotenv.config({ path: localEnv, override: true });
}

trimEnv(envKeys);
