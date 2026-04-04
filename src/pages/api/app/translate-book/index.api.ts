import { translateBookController } from "@/controlllers/translateBookController"
import { NextApiRequest, NextApiResponse } from "next"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return translateBookController(req, res)
  }

  return res.status(405).end()
}