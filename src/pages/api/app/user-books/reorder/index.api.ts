import { updateUserBookOrderController } from "@/controlllers/updateUserBookOrderController"
import { NextApiRequest, NextApiResponse } from "next"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PATCH") {
    return updateUserBookOrderController(req, res)
  }

  return res.status(405).end()
}