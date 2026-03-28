import { updateUserBookController } from "@/controlllers/updateUserBookController"
import { NextApiRequest, NextApiResponse } from "next"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PATCH") {
    return updateUserBookController(req, res)
  }

  if (req.method === "DELETE") {
    return 
  }

  return res.status(405).end()
}