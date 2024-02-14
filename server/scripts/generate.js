const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak.js");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

const privateKey = secp256k1.utils.randomPrivateKey();
const publicKey = secp256k1.getPublicKey(privateKey);
const address = toHex(keccak256(utf8ToBytes(`${publicKey}`)));
console.log(`private key: ${toHex(privateKey)}`);
console.log(`public key: ${toHex(publicKey)}`);
console.log(`address: 0x${address.slice(-20)}`);
