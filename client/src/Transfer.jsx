import { useState } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const message = "Sending " + sendAmount + " to " + recipient;
      const [signature, recoveryBit] = await signMessage(message);
      const fullSignature = toHex(new Uint8Array([recoveryBit, ...signature]));
      //const {
        //data: { balance },
      //} = 
      await server.post(`send`, {
        signature: fullSignature,
        message,
        amount: parseInt(sendAmount),
        recipient,
      }).then((response) => console.log(response.toString())).catch((error) => console.log(error))
      // setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  async function signMessage(msg) {
    const message = hashMessage(msg);
    return await secp256k1.sign(message, privateKey, {
      recovered: true,
    });
  }

  function hashMessage(message) {
    const messageBytes = utf8ToBytes(message);
    return keccak256(messageBytes);
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
