import { ethers } from "ethers";

interface TransferArgs {
  RPC_URL: string;
  PRIVATE_KEY: string;
  userAllowance: string;
  walletAddress: string;
}

interface TransactionArgs {
  to: string;
  value: ethers.BigNumber;
  gasPrice: ethers.BigNumber;
  gasLimit?: ethers.BigNumber;
}

export const executeEvmTransfer = async ({
  RPC_URL,
  PRIVATE_KEY,
  userAllowance,
  walletAddress,
}: TransferArgs) => {
  try {
    // Send the transaction
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const txAmount = ethers.utils.parseEther(userAllowance);
    const gasPrice = await provider.getGasPrice();

    const transaction: TransactionArgs = {
      to: walletAddress,
      value: txAmount,
      gasPrice: gasPrice,
    };

    const gasLimit = await wallet.estimateGas(transaction);
    transaction.gasLimit = gasLimit;

    const tx = await wallet.sendTransaction(transaction);
    return { ok: true, txHash: tx.hash };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      error: "Unable to process txn",
      details: (error as any).message,
    };
  }
};
