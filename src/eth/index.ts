import env from "@/env";
import { Web3 } from "web3";

const web3 = new Web3("https://ethereum-sepolia.publicnode.com")

export async function sendEth(recipientAddress: string, amountInEth: number) {
  const wallet = web3.eth.accounts.privateKeyToAccount(env.PRIVATE_KEY)
  console.log(wallet)

  const nonce = await web3.eth.getTransactionCount(wallet.address, 'latest');
  console.log("Found nonce", nonce)

  console.log("Sending eth to", recipientAddress)
  const signatureObj = await wallet.signTransaction({
    from: wallet.address,
    to: recipientAddress,
    maxFeePerGas: 100_000_000_000,
    maxPriorityFeePerGas: 10_000,
    value: amountInEth,
    nonce,
  })
  console.log("signature", signatureObj)

  web3.eth.sendSignedTransaction(signatureObj.rawTransaction).on("receipt", (recipet) => {
    console.log("txReceipt", recipet)
  })
  console.log("Transaction successfull")
  return signatureObj.transactionHash
}
