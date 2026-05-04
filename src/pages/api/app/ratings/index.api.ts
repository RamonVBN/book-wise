import { createRatingController } from "@/controlllers/createRatingController"

import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return createRatingController(req, res)
  }

  return res.status(405).end()
}