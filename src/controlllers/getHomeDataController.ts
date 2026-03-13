import { authOptions } from "@/pages/api/auth/[...nextauth].api"
import { getHomeData } from "@/services/getHomeData"
import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"

export async function getHomeController(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const session = await getServerSession(req, res, authOptions)

  const userId = session?.user?.id

  const homeData = await getHomeData({
    userId
  })

  return res.status(200).json(homeData)
}