import { sepolia, goerli, mumbai, stacks, flow } from "./networks";

interface NetworkConfig {
  on: boolean;
  RPC_URL: string;
  userAllowance: string;
}

interface ConfigData {
  sepolia: NetworkConfig;
  goerli: NetworkConfig;
  mumbai: NetworkConfig;
  stacks: NetworkConfig;
  flow: NetworkConfig;
  [key: string]: NetworkConfig;
}

const configData: ConfigData = {
  sepolia: sepolia,
  goerli: goerli,
  mumbai: mumbai,
  stacks: stacks,
  flow: flow,
};

export const getConfigData = (network: string) => {
  return configData[network];
};

console.log(getConfigData("sepolia"));
