const express = require("express");
const cron = require("node-cron");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const expenseEmail = require("./EmailService/Expense");

const app = express();

dotenv.config();

mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    console.log("db connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

const run = () => {
  cron.schedule("* * *", () => {
    expenseEmail();
  });
};

run();

app.listen(process.env.PORT, () => {
  console.log(`server is running on the port :${process.env.PORT}`);
});
