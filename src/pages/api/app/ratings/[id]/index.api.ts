import { deleteRatingController } from "@/controlllers/deleteRatingController"
import { updateRatingController } from "@/controlllers/updateRatingController"
import { NextApiRequest, NextApiResponse } from "next"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  if (req.method === 'DELETE') {
    return deleteRatingController(req, res)
  }

  if (req.method === 'PUT') {
    return updateRatingController(req, res)
  }

  return res.status(405).end()
}