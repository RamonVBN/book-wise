import { deleteUserBookController } from "@/controlllers/deleteUserBookController"
import { NextApiRequest, NextApiResponse } from "next"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === "DELETE") {
    return deleteUserBookController(req, res)
  }

  return res.status(405).end()
}