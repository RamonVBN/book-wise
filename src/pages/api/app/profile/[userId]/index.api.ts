import { getProfileController } from "@/controlllers/getProfileController"
import { NextApiRequest, NextApiResponse } from "next"


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method === "GET") {
    return getProfileController(req, res)
  }

  return res.status(405).json({ message: "Method not allowed" })
}