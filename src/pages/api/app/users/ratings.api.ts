import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse){

    if (req.method !== 'GET') {
        
        return res.status(405).end()
    }

    try {
        
        
    const ratings = await prisma.rating.findMany({
        omit: {bookId: true, userId: true},
        include: {book: {
            select: {author: true, name: true, coverUrl: true, summary: true}
        },
        user: {
            select: {
                name: true,
                avatarUrl: true, 
                email: true  
            }
        }}
    })


    return res.json({ratings})

    } catch (error) {
        
        return res.json({error})
    }
}