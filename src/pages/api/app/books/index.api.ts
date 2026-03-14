import type { NextApiRequest, NextApiResponse } from 'next'
import { getExploreBooksController } from '@/controlllers/getExploreBooksController'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if(req.method !== 'GET') {

    return res.status(405).json({message: 'Method not allowed'})
  }

  return getExploreBooksController(req, res)
}