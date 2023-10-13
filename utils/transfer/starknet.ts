import { TransferArgs } from "types/transfer";
import starknet from "starknet";
import ethers from "ethers";
import { starknetErc20Abi } from "constants/starknetABI";

export const executeStarknetTransfer = async ({
  RPC_URL,
  PRIVATE_KEY,
  userAllowance,
  walletAddress,
}: TransferArgs) => {
  try {
    const provider = new starknet.Provider({
      sequencer: {
        baseUrl: RPC_URL,
      },
    });
    const starkKeyPair = starknet.ec.getKeyPair(PRIVATE_KEY);
    const account = new starknet.Account(provider, "", starkKeyPair);
    // Get the ERC20 contract address
    const erc20Address =
      "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

    // Create a new erc20 contract object
    const erc20 = new starknet.Contract(
      starknetErc20Abi,
      erc20Address,
      account,
    );

    // Check balance before transfer
    console.log("Calling Starknet for account balance...");
    const balanceBeforeTransfer = await erc20.balanceOf(account.address);
    console.log(
      "Account has a balance of:",
      ethers.utils.formatEther(balanceBeforeTransfer.balance.low.toString()),
      "ETH",
    );

    // Execute tx transfer
    console.log("Invoke Tx - Transfer tokens to wallet address...");

    const hex = ethers.utils.parseEther(`${userAllowance}`)._hex;
    const tokenAmount = starknet.number.toBN(hex);
    const amountToTransfer = starknet.uint256.bnToUint256(tokenAmount);

    const { transaction_hash: transferTxHash } = await account.execute({
      contractAddress: erc20Address,
      entrypoint: "transfer",
      calldata: starknet.stark.compileCalldata({
        recipient: walletAddress,
        amount: {
          type: "struct",
          low: amountToTransfer.low,
          high: amountToTransfer.high,
        },
      }),
    });

    return { ok: true, txHash: transferTxHash };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      error: "Unable to process txn",
      details: (error as any).message,
    };
  }
};
