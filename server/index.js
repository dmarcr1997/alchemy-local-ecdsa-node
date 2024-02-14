const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const crypto = require("./crypto");
const express = require("express");
const morgan = require('morgan');
const winston = require('winston');

const app = express();
const cors = require("cors");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const port = 3042;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    //
    // - Write all logs with level `info` and below to `combined.log`
    // - Write all logs with level `error` and below to `error.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

app.use(morgan('tiny', {
  stream: {
    write: message => logger.info(message.trim()),
  },
}));

app.use(cors());
app.use(express.json());

const balances = {
  "0x90dfc65a0bfe5b3929d5": 100,
  //3814dfe74eef7d59e967ca9b183d02347b9dac727a431c354e2e0bdff8bee44f
  "0x7725dd861ff569c79184": 50,
  //ea9b43c7cd360a2ac3a04b9703f30a1e84be0d511c8feee46eef235770ec371c
  "0xbac73753cee729d66e5e": 75,
  //d5fe337822c305a81a02b32b130cb94fcd6aebf91b531e0d5920bfc6f6001f99
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  //get a signature from the client side application
  //recover the public address from the signature
  try {
    const { signature, message, recipient, amount } = req.body;
    
    const pubKey = crypto.signatureToPubKey(message, signature);
    const sender = crypto.pubKeyToAddress(pubKey);
    
    setInitialBalance(sender);
    setInitialBalance(recipient);
    logger.info(`DATA ${sender}, ${message}`);
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } catch (err) {
    logger.info(err.message);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
