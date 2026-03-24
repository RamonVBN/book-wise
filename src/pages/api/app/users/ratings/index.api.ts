import { createRatingController } from "@/controlllers/createRatingController"
import { deleteRatingController } from "@/controlllers/deleteRatingController"
import { getRatingsController } from "@/controlllers/getRatingsController"
import { updateRatingController } from "@/controlllers/updateRatingController"
import { NextApiRequest, NextApiResponse } from "next"


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
    return getRatingsController(req, res)
  }

  if (req.method === "POST") {
    return createRatingController(req, res)
  }

  if (req.method === 'DELETE') {
    return deleteRatingController(req, res)
  }

  if (req.method === 'PUT') {
    return updateRatingController(req, res)
  }

  return res.status(405).end()
}