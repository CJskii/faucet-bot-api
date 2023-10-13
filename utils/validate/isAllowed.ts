import { prisma } from "prisma/prismaClient";
import { validateWallet } from "./validateWallet";

interface IsAllowedResponse {
  ok: boolean;
  error: string | null;
}

interface IsAllowedArgs {
  userId: string;
  network: string;
  walletAddress: string;
}

export const isAllowed = async ({
  userId,
  network,
  walletAddress,
}: IsAllowedArgs) => {
  try {
    const webUser = await prisma.user.findFirst({
      where: {
        discordId: userId,
      },
    });

    if (!webUser) {
      return {
        ok: false,
        error:
          "You must connect your Discord account to your LearnWeb3 account to use the faucet. Please go to https://learnweb3.io/settings",
      };
    }

    const lastFaucetRequest = await prisma.discordFaucetRequest.findFirst({
      where: {
        discordUserId: userId,
        network,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (lastFaucetRequest) {
      const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;

      const lastRequestDate = lastFaucetRequest.createdAt;
      const lastRequestDatePlus24Hours = new Date(
        lastRequestDate.getTime() + TWENTY_FOUR_HOURS_IN_MS,
      );

      if (lastRequestDatePlus24Hours > new Date()) {
        return {
          ok: false,
          error: "You can only request faucet funds once every 24 hours.",
        };
      }
    }

    if (!validateWallet({ network, walletAddress }))
      return {
        ok: false,
        error: `Address ${walletAddress} doesn't exist on ${network} network`,
      };

    return {
      ok: true,
      error: null,
    };

    // MORE CHECKS AND ERRORS HERE
  } catch (error) {
    console.error("Error in isAllowed:", (error as any).message);
    return {
      ok: false,
      error: "Something went wrong. Please try again later.",
    };
  }
};
