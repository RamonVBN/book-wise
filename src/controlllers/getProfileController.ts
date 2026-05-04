import { prisma } from "@/lib/prisma"
import { getProfileData } from "@/services/getProfileData"
import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"

export async function getProfileController(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const querySchema = z.object({
    userId: z.string()
  })

  const { userId } = querySchema.parse(req.query)

  if (!userId){
    return res.status(401).json({ message: "Unauthorized" })
  }

  const user = prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  const profileData = await getProfileData({
    userId
  })

  return res.status(200).json(profileData)
}