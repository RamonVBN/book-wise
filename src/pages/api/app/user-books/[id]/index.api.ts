import { deleteUserBookController } from "@/controlllers/deleteUserBookController";
import { updateUserBookController } from "@/controlllers/updateUserBookController";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "DELETE") {
    return deleteUserBookController(req, res);
  }

  if (req.method === "PATCH") {
    return updateUserBookController(req, res);
  }

  return res.status(405).end();
}
