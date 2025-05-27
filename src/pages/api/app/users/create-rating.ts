import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";


export default async function handler(req: NextApiRequest, res: NextApiResponse){

    if (req.method !== 'POST') {
        
        return res.status(405).end()
    }

    const bodySchema = z.object({
        rate: z.number().gte(1),
        description: z.string(),
        bookId: z.string().min(1),
        userId: z.string().min(1)
    })

    const {rate, description, bookId, userId} = bodySchema.parse(req.body)

    await prisma.rating.create({
        data: {
           rate,
           description,
           bookId,
           userId
        }
    })


    return res.status(201).end()
}