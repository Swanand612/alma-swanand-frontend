import { NextApiRequest, NextApiResponse } from "next";
import { updateLeadStatus } from "./db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { leadId, status } = req.body;

  try {
    const updatedLeads = await updateLeadStatus(leadId, status);
    res.status(200).json(updatedLeads);
  } catch (error) {
    res
      .status(500)
      .json({ message: `${error + "Error updating lead status"}` });
  }
}
