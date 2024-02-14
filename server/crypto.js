const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { hexToBytes, toHex } = require("ethereum-cryptography/utils");

export function signatureToPubKey(message, signature) {
    const hash = hashMessage(message);
    const fullSignatureBytes = hexToBytes(signature);
    const recoveryBit = fullSignatureBytes[0];
    const signatureBytes = fullSignatureBytes.slice(1);

    return secp.recoverPublicKey(hash, signatureBytes, recoveryBit);
}

export function pubKeyToAddress(pubKey) {
    const hash = keccak256(pubKey.slice(1));
    return toHex(hash.slice(-20)).toUpperCase();

}

export function hashMessage(message) {
    const messageBytes = utf8ToBytes(message);
    return keccak256(messageBytes);
}