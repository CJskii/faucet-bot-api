const config = require(`../../config`);
require("dotenv").config();

const { executeZkSyncTransfer } = require("./networks/zksyncTransfer");
const { executeStarknetTransfer } = require("./networks/starknetTransfer");
const { executeStacksTransfer } = require("./networks/stacksTransfer");
const { executeFlowTransfer } = require("./networks/flowTransfer");

import { getConfigData } from "config";
import { getPrivateKey } from "utils/getPrivateKey";
import { executeEvmTransfer } from "./evm";

interface SendFaucetTokensArgs {
  network: string;
  walletAddress: string;
}

export const sendFaucetTokens = async ({
  network,
  walletAddress,
}: SendFaucetTokensArgs) => {
  const faucetConfig = getConfigData(network);
  if (!faucetConfig) return { ok: false, error: "Invalid network" };

  const { on, RPC_URL, userAllowance } = faucetConfig;
  const { PRIVATE_KEY, ADDRESS } = getPrivateKey(network);

  if (!on)
    return { ok: false, error: "Faucet for this network is not available" };
  if (!PRIVATE_KEY) return { ok: false, error: "Invalid private key" };
  switch (network.toLowerCase()) {
    default: {
      return await executeEvmTransfer({
        RPC_URL,
        PRIVATE_KEY,
        userAllowance,
        walletAddress,
      });
    }
    case "zksync": {
      // TODO: Uncomment this when zksync is ready
      //   return await executeZkSyncTransfer(
      //     RPC_URL,
      //     PRIVATE_KEY,
      //     userAllowance,
      //     walletAddress,
      //   );
    }
    case "starknet": {
      // TODO: Uncomment this when starknet is ready
      //   return await executeStarknetTransfer(
      //     RPC_URL,
      //     PRIVATE_KEY,
      //     userAllowance,
      //     walletAddress,
      //   );
    }
    case "flow": {
      return await executeFlowTransfer(
        ADDRESS,
        PRIVATE_KEY,
        walletAddress,
        userAllowance,
      );
    }
    case "stacks": {
      return await executeStacksTransfer(
        PRIVATE_KEY,
        walletAddress,
        userAllowance,
      );
    }
  }
};

module.exports = { sendFaucetTokens };
