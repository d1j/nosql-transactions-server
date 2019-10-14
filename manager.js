module.exports.registerUser = async data => {
  return "registerUser";
};

module.exports.openAccount = async data => {
  return "openAccount";
};

module.exports.processTransaction = async data => {
  return "processTransaction";
};

module.exports.increaseBalance = async data => {
  return "increaseBalance";
};

module.exports.getUsers = async () => {
  return [
    {
      id: "yidas",
      name: "yeet",
      surname: "yote",
      email: "yeeet",
      phone: "yooot",
      account_id: "yeeeet",
      account_balance: "yoooote"
    }
  ];
};

module.exports.getTransactions = async () => {
  return [{ sender_id: 1, receiver_id: 2, ammount: 3 }];
};
