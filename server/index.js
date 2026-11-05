import "./config/env.js";
import cors from "cors";
import express from "express";
import { sendContactEmails } from "./services/email.js";

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173,http://localhost:4173"
)
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json({ limit: "32kb" }));

function isEmailConfigured() {
  const hasSmtp = Boolean(
    (process.env.SMTP_USER || process.env.EMAIL_USER) &&
      (process.env.SMTP_PASS || process.env.EMAIL_PASS)
  );
  const hasEmailJs = Boolean(
    process.env.EMAILJS_SERVICE_ID &&
      process.env.EMAILJS_PUBLIC_KEY &&
      process.env.EMAILJS_PRIVATE_KEY &&
      process.env.EMAILJS_TEMPLATE_OWNER &&
      process.env.EMAILJS_TEMPLATE_USER
  );
  return hasSmtp || hasEmailJs;
}

app.get("/api/health", (_req, res) => {
  const emailConfigured = isEmailConfigured();
  const provider = (process.env.SMTP_USER || process.env.EMAIL_USER)
    ? "nodemailer (smtp)"
    : process.env.EMAILJS_SERVICE_ID
    ? "emailjs"
    : "not_configured";

  res.json({
    ok: true,
    storage: "none",
    emailConfigured,
    provider,
  });
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body ?? {};

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({
        error: "Name, email, and message are required.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address." });
    }

    const emailStatus = await sendContactEmails({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    if (emailStatus.reason === "email_not_configured" || emailStatus.reason === "emailjs_not_configured") {
      return res.status(500).json({
        success: false,
        emailsSent: false,
        error: "Email service is not configured. Please set EMAIL_USER and EMAIL_PASS in the .env file.",
      });
    }

    if (!emailStatus.sent) {
      return res.status(500).json({
        success: false,
        emailsSent: false,
        error: emailStatus.reason || "Failed to send email. Please try again later.",
      });
    }

    const responseMessage = emailStatus.partial
      ? `Message sent, but notification had an issue: ${emailStatus.reason}`
      : "Thank you for reaching out! Your message has been sent successfully.";

    res.status(200).json({
      success: true,
      emailsSent: true,
      message: responseMessage,
    });
  } catch (err) {
    console.error("[contact] Submission error:", err);
    res.status(500).json({
      error: "Failed to send contact email. Please try again later.",
      details: err.message,
    });
  }
});

const server = app.listen(PORT, () => {
  console.log(`API ready → http://localhost:${PORT}`);
  if (isEmailConfigured()) {
    const provider = (process.env.SMTP_USER || process.env.EMAIL_USER)
      ? "Nodemailer (SMTP/Gmail)"
      : "EmailJS";
    console.log(`[email] Service active using: ${provider}`);
  } else {
    console.warn(
      "[email] No email credentials found in environment. Add EMAIL_USER & EMAIL_PASS to .env"
    );
  }
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `\nPort ${PORT} is already in use. Close the other process or run:\n  npx kill-port ${PORT}\n`
    );
    process.exit(1);
  }
  throw err;
});
