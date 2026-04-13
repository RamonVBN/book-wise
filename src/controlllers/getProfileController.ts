import { authOptions } from "@/pages/api/auth/[...nextauth].api"
import { getProfileData } from "@/services/getProfileData"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
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

  const profileData = await getProfileData({
    userId
  })

  return res.status(200).json(profileData)
}