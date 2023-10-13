import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "utils/validate/verifyToken";
import { isAllowed } from "utils/validate/isAllowed";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const token = req.headers.authorization?.split(" ")[1];

  if (!token || !verifyToken(token)) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  const { discordId, network, recipientAddress } = req.body;

  if (!discordId || !network || !recipientAddress) {
    return res.status(400).json({ ok: false, error: "Invalid data" });
  }

  const { ok, error } = await isAllowed({
    userId: discordId,
    network,
    walletAddress: recipientAddress,
  });

  if (!ok) {
    return res.status(400).json({ ok: false, error });
  }

  // ALL VALIDATIONS PASSED

  // Execute transfer call
  // ...

  // Return message with the link to discord
  // ...

  return res.status(200).json({ ok: true, value: "BLOCK_EXPLORER_LINK" });
}
