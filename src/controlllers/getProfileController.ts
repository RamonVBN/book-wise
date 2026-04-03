import { authOptions } from "@/pages/api/auth/[...nextauth].api"
import { getProfileData } from "@/services/getProfileData"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"

export async function getProfileController(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const session = await getServerSession(req, res, authOptions)

  const userId = session?.user?.id

  if (!userId){
    return res.status(401).json({ message: "Unauthorized" })
  }

  const profileData = await getProfileData({
    userId
  })

  console.log(profileData.userRatings)

  return res.status(200).json(profileData)
}