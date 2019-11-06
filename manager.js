let redis = require("redis");
let bluebird = require("bluebird");
bluebird.promisifyAll(redis);
let client = redis.createClient();
let userID = 0;
let accountID = 0;
let transactionID = 0;

client.on("error", function(err) {
  console.log("Error " + err);
});

module.exports.registerUser = async function({ name, surname, email, phone }) {
  try {
    await client.hmsetAsync(
      `user:${userID}`,
      "name",
      name,
      "surname",
      surname,
      "email",
      email,
      "phone",
      phone
    );
    return userID++;
  } catch (err) {
    throw err;
  }
};

module.exports.openAccount = async function({
  user_id,
  balance,
  expiry_date,
  card_number
}) {
  try {
    await client.hmset(
      `account:${accountID}`,
      "balance",
      +balance,
      "expiry_date",
      expiry_date,
      "card_number",
      +card_number
    );
    await client.set(`user_account:${user_id}`, accountID);

    return accountID++;
  } catch (err) {
    throw err;
  }
};

module.exports.processTransaction = async function({
  sender,
  receiver,
  ammount
}) {
  try {
    transactionID++;
    let senderAccountID = await client.getAsync(`user_account:${sender}`);
    let receiverAccountID = await client.getAsync(`user_account:${receiver}`);
    let sendersAccount = await client.hgetallAsync(
      `account:${senderAccountID}`
    );
    if (+sendersAccount.balance < +ammount) {
      throw "Transaction failed. Sender does not have enough money in the account.";
    }

    client.watch(`account:${senderAccountID}`, function(err) {
      if (err) throw err;
      client
        .multi()
        .hincrby(`account:${senderAccountID}`, "balance", +ammount * -1)
        .hincrby(`account:${receiverAccountID}`, "balance", +ammount)
        .hmset(
          `transaction:${transactionID}`,
          "sender_id",
          sender,
          "receiver_id",
          receiver,
          "ammount",
          +ammount
        )
        .exec((err, replies) => {
          if (err) {
            console.log(err);
          }
          if (replies == null) {
            console.log("Transakcija neįvykdyta.");
          }
        });
    });
  } catch (err) {
    throw err;
  }
};

module.exports.flushAll = async function() {
  try {
    userID = 0;
    accountID = 0;
    transactionID = 0;
    await client.flushallAsync();
  } catch (err) {
    throw err;
  }
};

module.exports.getUsers = async function() {
  try {
    let userKeys = await client.keysAsync("user:*");
    let data = [];
    for (let i = 0; i < userKeys.length; i++) {
      let user = await client.hgetallAsync(userKeys[i]);
      let accountID = await client.getAsync(
        `user_account:${userKeys[i].split(":")[1]}`
      );
      let account = {};
      if (accountID != null) {
        account = await client.hgetallAsync(`account:${accountID}`);
        account.account_id = accountID;
      }
      data.push({
        ...user,
        ...account,
        id: userKeys[i].split(":")[1]
      });
    }
    return data;
  } catch (err) {
    throw err;
  }
};

module.exports.getTransactions = async function() {
  try {
    let transactionsKeys = await client.keysAsync("transaction:*");
    let data = [];
    for (let i = 0; i < transactionsKeys.length; i++) {
      let transaction = await client.hgetallAsync(transactionsKeys[i]);
      data.push(transaction);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

module.exports.increaseBalance = async function({ add_ammount, account_id }) {
  try {
    await client.hincrby(`account:${account_id}`, "balance", +add_ammount);
  } catch (err) {
    throw err;
  }
};
