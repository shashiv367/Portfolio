function getIstTimestamp() {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

function parseEmailJsError(status, detail, templateId) {
  if (status === 403 && detail.includes("non-browser environments")) {
    return (
      "EmailJS blocks server requests. Enable “Allow API requests from non-browser applications” " +
      "at dashboard.emailjs.com/admin/account/security, then restart npm run dev."
    );
  }
  if (status === 403 && detail.includes("strict mode")) {
    return "EmailJS strict mode is on but EMAILJS_PRIVATE_KEY is missing or wrong in .env.local.";
  }
  if (status === 400 && detail.includes("template ID not found")) {
    return (
      `EmailJS template "${templateId}" not found. Set EMAILJS_TEMPLATE_OWNER=template_m6re0p1 ` +
      `(Contact Us) and EMAILJS_TEMPLATE_USER=template_l3subed (Auto-Reply) in .env.local, then restart npm run dev.`
    );
  }
  return `EmailJS error ${status}: ${detail}`;
}

async function sendTemplate(templateId, templateParams) {
  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: templateId,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      accessToken: process.env.EMAILJS_PRIVATE_KEY,
      template_params: templateParams,
    }),
  });

  const detail = await response.text();

  if (!response.ok) {
    throw new Error(parseEmailJsError(response.status, detail, templateId));
  }

  try {
    return JSON.parse(detail);
  } catch {
    return { status: detail || "OK" };
  }
}

export async function sendContactEmails({ name, email, message }) {
  if (!isEmailJsConfigured()) {
    console.warn(
      "[email] EmailJS not configured. Set EMAILJS_* in .env or .env.local"
    );
    return { sent: false, reason: "emailjs_not_configured" };
  }

  const submittedAt = getIstTimestamp();
  const ownerEmail = process.env.OWNER_EMAIL || "vardhans367@gmail.com";

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

  const errors = [];

  try {
    await sendTemplate(process.env.EMAILJS_TEMPLATE_OWNER, {
      ...baseParams,
      to_email: ownerEmail,
    });
  } catch (err) {
    errors.push(`owner notification: ${err.message}`);
  }

  try {
    await sendTemplate(process.env.EMAILJS_TEMPLATE_USER, {
      ...baseParams,
      to_email: email,
      customer_name: name,
    });
  } catch (err) {
    errors.push(`visitor confirmation: ${err.message}`);
  }

  if (errors.length === 2) {
    throw new Error(errors.join(" | "));
  }

  if (errors.length === 1) {
    return { sent: true, partial: true, reason: errors[0] };
  }

  return { sent: true };
}
