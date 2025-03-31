const dotenv = require("dotenv");
const sendMail = require("../helpers/sendMail");
const Expense = require("../models/Expense");

// Load environment variables
dotenv.config();

const EXPENSE_THRESHOLD = 10000; // You can move this to .env if needed

const expenseEmail = async () => {
  try {
    // Debug: Verify environment variables are loading
    console.log("Checking environment variables...");
    console.log("EMAIL:", process.env.EMAIL ? "✅ Loaded" : "❌ Missing");
    console.log(
      "ADMIN_EMAIL:",
      process.env.ADMIN_EMAIL ? "✅ Loaded" : "❌ Missing"
    );

    // Validate required environment variables
    if (!process.env.ADMIN_EMAIL) {
      console.error("Error: ADMIN_EMAIL is not configured in .env file");
      return false;
    }

    if (!process.env.EMAIL || !process.env.PASSWORD) {
      console.error("Error: Email credentials not fully configured in .env");
      return false;
    }

    // Calculate total expenses
    const expenses = await Expense.find();
    const totalExpense = expenses.reduce(
      (acc, expense) => acc + expense.value,
      0
    );

    console.log(`Current total expenses: $${totalExpense}`);

    // Check if threshold exceeded
    if (totalExpense > EXPENSE_THRESHOLD) {
      console.log(
        `Threshold exceeded (${totalExpense} > ${EXPENSE_THRESHOLD}), sending alert...`
      );

      const messageOptions = {
        from: `"Expense Tracker" <${process.env.EMAIL}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `🚨 Expense Alert: $${totalExpense}`,
        text: `Your total expenses have reached $${totalExpense}, exceeding the $${EXPENSE_THRESHOLD} threshold.`,
        html: `
          <h2>Expense Alert</h2>
          <p>Total expenses: <strong>$${totalExpense}</strong></p>
          <p>This exceeds your threshold of <strong>$${EXPENSE_THRESHOLD}</strong></p>
          <p>Please review your expenses.</p>
        `,
      };

      const result = await sendMail(messageOptions);
      if (result) {
        console.log(`Success: Alert sent to ${process.env.ADMIN_EMAIL}`);
        return true;
      }
    } else {
      console.log(`Total expenses $${totalExpense} are within limits.`);
    }
    return false;
  } catch (error) {
    console.error("Error in expenseEmail:", error.message);
    return false;
  }
};

module.exports = expenseEmail;
