import "./config/env.js";
import cors from "cors";
import express from "express";
import { saveContactSubmission, markEmailsSent } from "./db.js";
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

app.get("/api/health", (_req, res) => {
  const emailConfigured = Boolean(
    process.env.EMAILJS_SERVICE_ID &&
      process.env.EMAILJS_PUBLIC_KEY &&
      process.env.EMAILJS_PRIVATE_KEY &&
      process.env.EMAILJS_TEMPLATE_OWNER &&
      process.env.EMAILJS_TEMPLATE_USER
  );
  res.json({
    ok: true,
    storage: "firebase",
    emailConfigured,
    templates: emailConfigured
      ? {
          owner: process.env.EMAILJS_TEMPLATE_OWNER,
          user: process.env.EMAILJS_TEMPLATE_USER,
        }
      : undefined,
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

    const submission = await saveContactSubmission({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    let emailStatus = { sent: false };
    try {
      emailStatus = await sendContactEmails({
        name: submission.name,
        email: submission.email,
        message: submission.message,
      });
      if (emailStatus.sent) {
        await markEmailsSent(submission.id);
      }
    } catch (emailErr) {
      console.error("[contact] Email error:", emailErr.message);
      emailStatus = { sent: false, reason: emailErr.message };
    }

    const emailsSent = emailStatus.sent === true;
    const partialEmail = emailStatus.partial === true;

    let responseMessage;
    if (emailsSent && !partialEmail) {
      responseMessage = "Message saved. Thank you.";
    } else if (emailsSent && partialEmail) {
      responseMessage = `Message saved. ${emailStatus.reason}`;
    } else if (emailStatus.reason === "emailjs_not_configured") {
      responseMessage =
        "Message saved. Add EMAILJS_* variables to .env.local and restart npm run dev.";
    } else {
      responseMessage = `Message saved. Email failed: ${emailStatus.reason || "see server logs"}`;
    }

    res.status(201).json({
      success: true,
      id: submission.id,
      emailsSent,
      emailError: emailsSent ? emailStatus.reason : emailStatus.reason,
      message: responseMessage,
    });
  } catch (err) {
    console.error("[contact]", err);
    res.status(500).json({
      error: err.message?.includes("Firebase")
        ? "Database not configured. See FIREBASE_SETUP.md"
        : "Failed to submit contact form.",
    });
  }
});

const server = app.listen(PORT, () => {
  console.log(`API ready → http://localhost:${PORT}`);
  if (process.env.EMAILJS_TEMPLATE_OWNER) {
    console.log(
      `[email] templates: owner=${process.env.EMAILJS_TEMPLATE_OWNER} user=${process.env.EMAILJS_TEMPLATE_USER}`
    );
  } else {
    console.warn("[email] EMAILJS_* not loaded — check .env.local");
  }
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `\nPort ${PORT} is already in use. Close the other terminal or run:\n  npx kill-port ${PORT}\n`
    );
    process.exit(1);
  }
  throw err;
});
