import ethers from "ethers";
import { validateStacksAddress } from "@stacks/transactions";
import fcl from "@onflow/fcl";

interface IValidateWallet {
  network: string;
  walletAddress: string;
}

export const validateWallet = async ({
  network,
  walletAddress,
}: IValidateWallet) => {
  switch (network) {
    case "stacks":
      return validateStacksAddress(walletAddress);
    case "flow":
      const isValidAddress = await fcl.account(walletAddress).catch((error) => {
        return false;
      });
      if (isValidAddress.address) {
        return true;
      }
    default:
      return ethers.utils.isAddress(walletAddress);
  }
};
