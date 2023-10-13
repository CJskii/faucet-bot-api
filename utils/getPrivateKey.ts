export const getPrivateKey = (network: string) => {
  switch (network.toLowerCase()) {
    default:
      return {
        PRIVATE_KEY: process.env.PRIVATE_KEY,
        ADDRESS: "",
      };
    case "goerli":
      return { PRIVATE_KEY: process.env.GOERLI_PRIVATE_KEY, ADDRESS: "" };
    case "mumbai":
      return { PRIVATE_KEY: process.env.MUMBAI_PRIVATE_KEY, ADDRESS: "" };
    case "sepolia":
      return { PRIVATE_KEY: process.env.SEPOLIA_PRIVATE_KEY, ADDRESS: "" };
    case "starknet":
      return { PRIVATE_KEY: process.env.STARKNET_PRIVATE_KEY, ADDRESS: "" };
    case "flow":
      return {
        PRIVATE_KEY: process.env.FLOW_PRIVATE_KEY,
        ADDRESS: process.env.FLOW_PRIVATE_KEY,
      };
    case "stacks":
      return { PRIVATE_KEY: process.env.STACKS_PRIVATE_KEY, ADDRESS: "" };
    case "zksync":
      return { PRIVATE_KEY: process.env.ZKSYNC_PRIVATE_KEY, ADDRESS: "" };
  }
};
