import zksync from "zksync-web3";
import { ethers } from "ethers";

interface TransferArgs {
  RPC_URL: string;
  PRIVATE_KEY: string;
  userAllowance: string;
  walletAddress: string;
}

export const executeZkSyncTransfer = async ({
  RPC_URL,
  PRIVATE_KEY,
  userAllowance,
  walletAddress,
}: TransferArgs) => {
  try {
    const zkSyncProvider = new zksync.Provider(RPC_URL);
    const ethProvider = ethers.getDefaultProvider("goerli");
    const zkSyncWallet = new zksync.Wallet(
      PRIVATE_KEY,
      zkSyncProvider,
      ethProvider,
    );
    const amount = ethers.utils.parseEther(userAllowance);
    const transfer = await zkSyncWallet.transfer({
      to: walletAddress,
      token: zksync.utils.ETH_ADDRESS,
      amount,
    });

    const committedTxReceipt = await transfer.wait();
    return { ok: true, txHash: committedTxReceipt.transactionHash };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      error: "Unable to process txn",
      details: (error as any).message,
    };
  }
};
