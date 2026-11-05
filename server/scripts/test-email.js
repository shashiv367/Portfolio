import "../config/env.js";
import { sendContactEmails } from "../services/email.js";

async function run() {
  console.log("=========================================");
  console.log("   Portfolio Email Dispatch Test Script   ");
  console.log("=========================================\n");

  const testName = process.env.TEST_CLIENT_NAME || "Alex Johnson";
  const testEmail = process.env.TEST_CLIENT_EMAIL || process.env.OWNER_EMAIL || "vardhans367@gmail.com";
  const testMessage =
    process.env.TEST_CLIENT_MESSAGE ||
    "Hello Shashi, I checked out your portfolio and would love to discuss a potential project collaboration!";

  console.log(`Sending test inquiry:`);
  console.log(`- From Client: ${testName} <${testEmail}>`);
  console.log(`- To Host:     ${process.env.OWNER_EMAIL || "vardhans367@gmail.com"}`);
  console.log(`- Message:     "${testMessage}"\n`);

  try {
    const result = await sendContactEmails({
      name: testName,
      email: testEmail,
      message: testMessage,
    });

    if (result.sent) {
      console.log("SUCCESS! Both emails dispatched:");
      console.log("  1. Host notification with contact form message");
      console.log("  2. Client thank-you confirmation auto-reply");
      if (result.partial) {
        console.warn(`  Notice: ${result.reason}`);
      }
    } else {
      console.error("FAILED to send emails:");
      console.error(`  Reason: ${result.reason}`);
      console.log("\nSetup instructions:");
      console.log("  Create a .env file with your Gmail credentials:");
      console.log("  EMAIL_USER=your-email@gmail.com");
      console.log("  EMAIL_PASS=your-16-character-google-app-password");
      console.log("  OWNER_EMAIL=vardhans367@gmail.com");
    }
  } catch (err) {
    console.error("Error running test email dispatch:", err.message);
  }
}

run();
