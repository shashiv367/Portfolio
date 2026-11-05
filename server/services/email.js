import nodemailer from "nodemailer";

function getIstTimestamp() {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getSmtpConfig() {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  let pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (!user || !pass) {
    return null;
  }

  // Strip spaces if user pasted a 16-character Google App Password with spaces
  if (!host || host.includes("gmail") || user.includes("@gmail.com")) {
    pass = pass.replace(/\s+/g, "");
  }

  if (host) {
    return {
      host,
      port,
      secure,
      auth: { user, pass },
    };
  }

  // Default to standard Gmail service if user is provided
  return {
    service: "gmail",
    auth: { user, pass },
  };
}

function isEmailJsConfigured() {
  return Boolean(
    process.env.EMAILJS_SERVICE_ID &&
      process.env.EMAILJS_PUBLIC_KEY &&
      process.env.EMAILJS_PRIVATE_KEY &&
      process.env.EMAILJS_TEMPLATE_OWNER &&
      process.env.EMAILJS_TEMPLATE_USER
  );
}

async function sendViaEmailJs({ name, email, message, submittedAt, ownerEmail }) {
  const baseParams = {
    name,
    email,
    message,
    time: submittedAt,
    title: `Portfolio — ${name}`,
    to_email: ownerEmail,
    from_name: name,
    reply_to: email,
  };

  async function postTemplate(templateId, params) {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: templateId,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: params,
      }),
    });
    const detail = await response.text();
    if (!response.ok) {
      throw new Error(`EmailJS error (${response.status}): ${detail}`);
    }
  }

  const errors = [];
  try {
    await postTemplate(process.env.EMAILJS_TEMPLATE_OWNER, {
      ...baseParams,
      to_email: ownerEmail,
    });
  } catch (err) {
    errors.push(`Host email error: ${err.message}`);
  }

  try {
    await postTemplate(process.env.EMAILJS_TEMPLATE_USER, {
      ...baseParams,
      to_email: email,
      customer_name: name,
    });
  } catch (err) {
    errors.push(`Client email error: ${err.message}`);
  }

  if (errors.length === 2) {
    throw new Error(errors.join(" | "));
  }

  if (errors.length === 1) {
    return { sent: true, partial: true, reason: errors[0] };
  }

  return { sent: true };
}

function buildHostEmailHtml({ name, email, message, submittedAt }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0a09; color: #f5f5f4; margin: 0; padding: 24px; }
          .container { max-width: 600px; margin: 0 auto; background: #1c1917; border-radius: 12px; border: 1px solid #292524; overflow: hidden; }
          .header { background: linear-gradient(135deg, #2e1065, #09090b); padding: 28px 32px; border-bottom: 1px solid #3b0764; }
          .header h1 { margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; }
          .content { padding: 32px; }
          .field { margin-bottom: 20px; }
          .label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #a8a29e; margin-bottom: 4px; }
          .value { font-size: 16px; color: #f5f5f4; }
          .message-box { background: #0c0a09; border: 1px solid #292524; border-radius: 8px; padding: 18px; line-height: 1.6; color: #e7e5e4; margin-top: 8px; }
          .btn-container { margin-top: 28px; }
          .reply-btn { display: inline-block; background: #fafaf9; color: #0c0a09; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-size: 14px; }
          .footer { padding: 20px 32px; border-top: 1px solid #292524; font-size: 12px; color: #78716c; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Sender Name</div>
              <div class="value">${safeName}</div>
            </div>
            <div class="field">
              <div class="label">Sender Email</div>
              <div class="value"><a href="mailto:${safeEmail}" style="color: #a78bfa; text-decoration: none;">${safeEmail}</a></div>
            </div>
            <div class="field">
              <div class="label">Received At</div>
              <div class="value">${submittedAt} IST</div>
            </div>
            <div class="field">
              <div class="label">Message</div>
              <div class="message-box">${safeMessage}</div>
            </div>
            <div class="btn-container">
              <a href="mailto:${safeEmail}?subject=Re: Portfolio Inquiry" class="reply-btn">Reply to ${safeName}</a>
            </div>
          </div>
          <div class="footer">
            Portfolio Contact System • Shashi Vardhan
          </div>
        </div>
      </body>
    </html>
  `;
}

function buildClientEmailHtml({ name, message }) {
  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0a09; color: #f5f5f4; margin: 0; padding: 24px; }
          .container { max-width: 600px; margin: 0 auto; background: #1c1917; border-radius: 12px; border: 1px solid #292524; overflow: hidden; }
          .header { background: linear-gradient(135deg, #1e1b4b, #09090b); padding: 28px 32px; border-bottom: 1px solid #312e81; }
          .header h1 { margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; }
          .content { padding: 32px; line-height: 1.6; font-size: 15px; color: #e7e5e4; }
          .greeting { font-size: 17px; font-weight: 600; color: #fafaf9; margin-bottom: 14px; }
          .message-quote { background: #0c0a09; border-left: 3px solid #818cf8; border-radius: 4px; padding: 14px 18px; margin: 20px 0; color: #d6d3d1; font-style: italic; }
          .signature { margin-top: 28px; padding-top: 20px; border-top: 1px solid #292524; }
          .name { font-weight: 700; color: #ffffff; font-size: 16px; }
          .title { color: #a8a29e; font-size: 13px; margin-top: 2px; }
          .contact-links { margin-top: 10px; font-size: 13px; color: #818cf8; }
          .contact-links a { color: #818cf8; text-decoration: none; margin-right: 14px; }
          .footer { padding: 18px 32px; border-top: 1px solid #292524; font-size: 12px; color: #78716c; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Reaching Out!</h1>
          </div>
          <div class="content">
            <div class="greeting">Hi ${safeName},</div>
            <p>
              Thank you for visiting my portfolio and taking the time to send a message!
              I have received your inquiry and will review it and get back to you as soon as possible.
            </p>
            <p style="margin-top: 16px; margin-bottom: 6px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #a8a29e;">
              A copy of your message:
            </p>
            <div class="message-quote">
              ${safeMessage}
            </div>
            <p>
              If your request is urgent, you can also reach me directly via phone or WhatsApp at 
              <strong style="color: #fafaf9;">+91 9063531983</strong>.
            </p>
            <div class="signature">
              <div class="name">Shashi Vardhan</div>
              <div class="title">Full Stack Developer & AIML Engineer • Hyderabad, India</div>
              <div class="contact-links">
                <a href="mailto:vardhans367@gmail.com">vardhans367@gmail.com</a>
              </div>
            </div>
          </div>
          <div class="footer">
            This is an automated confirmation sent from Shashi Vardhan's Portfolio.
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function sendContactEmails({ name, email, message }) {
  const submittedAt = getIstTimestamp();
  const ownerEmail = process.env.OWNER_EMAIL || "vardhans367@gmail.com";
  const smtpConfig = getSmtpConfig();

  // Method 1: Nodemailer (SMTP / Gmail)
  if (smtpConfig) {
    const transporter = nodemailer.createTransport(smtpConfig);
    const fromAddress =
      process.env.EMAIL_FROM ||
      `"Shashi Vardhan via Portfolio" <${smtpConfig.auth.user}>`;

    const errors = [];

    // 1. Email to host (contact form details)
    try {
      await transporter.sendMail({
        from: fromAddress,
        to: ownerEmail,
        replyTo: `${name} <${email}>`,
        subject: `📬 New Contact Form Submission from ${name}`,
        text: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nDate: ${submittedAt} IST\n\nMessage:\n${message}`,
        html: buildHostEmailHtml({ name, email, message, submittedAt }),
      });
      console.log(`[email] Host notification sent to ${ownerEmail}`);
    } catch (err) {
      console.error(`[email] Failed to send to host (${ownerEmail}):`, err.message);
      errors.push(`host notification: ${err.message}`);
    }

    // 2. Thank you email to client
    try {
      await transporter.sendMail({
        from: fromAddress,
        to: email,
        replyTo: ownerEmail,
        subject: `Thank you for reaching out, ${name}!`,
        text: `Hi ${name},\n\nThank you for reaching out through my portfolio. I have received your message and will get back to you shortly.\n\nYour message:\n${message}\n\nBest regards,\nShashi Vardhan\nvardhans367@gmail.com`,
        html: buildClientEmailHtml({ name, message }),
      });
      console.log(`[email] Thank-you confirmation sent to client ${email}`);
    } catch (err) {
      console.error(`[email] Failed to send to client (${email}):`, err.message);
      errors.push(`client confirmation: ${err.message}`);
    }

    if (errors.length === 2) {
      throw new Error(errors.join(" | "));
    }

    if (errors.length === 1) {
      return { sent: true, partial: true, reason: errors[0] };
    }

    return { sent: true };
  }

  // Method 2: EmailJS fallback if configured
  if (isEmailJsConfigured()) {
    console.log("[email] Sending via EmailJS...");
    return await sendViaEmailJs({ name, email, message, submittedAt, ownerEmail });
  }

  console.warn(
    "[email] No email credentials configured. Please set EMAIL_USER & EMAIL_PASS in .env"
  );
  return {
    sent: false,
    reason: "email_not_configured",
  };
}
