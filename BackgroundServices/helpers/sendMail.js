const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// Email configuration (Gmail SMTP)
const configurations = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
};

// Create reusable transporter
function createTransporter(config) {
  return nodemailer.createTransport(config);
}

// Send email with validation
const sendMail = async (messageOption) => {
  try {
    // Validate required fields
    if (!messageOption?.to) {
      throw new Error("Missing recipient email (to)");
    }
    if (!messageOption?.subject) {
      throw new Error("Missing email subject");
    }
    if (!messageOption?.text && !messageOption?.html) {
      throw new Error("Missing email body (text or html)");
    }

    const transporter = createTransporter(configurations);

    // Verify connection
    await transporter.verify();
    console.log("SMTP server connection verified");

    // Send mail with default 'from' if not provided
    const info = await transporter.sendMail({
      from: `"Expense Tracker" <${process.env.EMAIL}>`, // Default sender
      ...messageOption, // User-provided options
    });

    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Email error:", error.message);
    throw error; // Re-throw to handle in calling function
  }
};

module.exports = sendMail;
