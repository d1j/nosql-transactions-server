const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

const manager = require("./manager.js");

const contentCheck = (body, content) => {
  for (let i = 0; i < content.length; i++) {
    if (typeof body[content[i]] === "undefined") {
      throw `Missing: ${content[i]}`;
    }
  }
};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/display-users", async (req, res) => {
  try {
    console.log("/display-users");
    let users = await manager.getUsers();
    res.status(200).json({ users });
    console.log("success\n");
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/display-transactions", async (req, res) => {
  try {
    console.log("/display-transactions");
    let transactions = await manager.getTransactions();
    res.status(200).json({ transactions });
    console.log("success\n");
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/register-user", async (req, res) => {
  try {
    console.log("/register-user");
    contentCheck(req.body, ["name", "surname", "email", "phone"]);
    let userID = await manager.registerUser(req.body);
    res.status(201).json({ user_id: userID });
    console.log("success\n");
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/open-account", async (req, res) => {
  try {
    console.log("/open-account");
    contentCheck(req.body, [
      "user_id",
      "balance",
      "expiry_date",
      "card_number"
    ]);
    let accountID = await manager.openAccount(req.body);
    res.status(201).json({ account_id: accountID });
    console.log("success\n");
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/process-transaction", async (req, res) => {
  try {
    console.log("/process-transaction");
    contentCheck(req.body, ["sender", "receiver", "ammount"]);
    await manager.processTransaction(req.body);
    res.status(201).json({ status: "ok" });
    console.log("success\n");
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/increase-balance", async (req, res) => {
  try {
    console.log("/increase-balance");
    contentCheck(req.body, ["add_ammount", "account_id"]);
    await manager.increaseBalance(req.body);
    res.status(200).json({ status: "success" });
    console.log("success\n");
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/flush-redis", async (req, res) => {
  try {
    console.log("/flush-redis");
    await manager.flushAll();
    res.sendStatus(200);
    console.log("success\n");
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(3001, () => {
  console.log("Application is listening on port 3001...");
});
