import { getBookRatingsController } from "@/controlllers/getBookRatingsController"
import { NextApiRequest, NextApiResponse } from "next"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        return getBookRatingsController(req, res)
    }

  return res.status(405).end()
}