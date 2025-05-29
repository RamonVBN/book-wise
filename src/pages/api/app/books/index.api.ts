import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse){

    if (req.method !== 'GET') {
        
        return res.status(405).end()
    }

   
    const books = await prisma.book.findMany({
        include: {
            categories: {
                select: {
                    category: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            ratings: {
                select: {
                    rate: true,
                    createdAt: true,
                    description: true,
                    user: {
                        select: {
                            avatarUrl: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }
        },
        orderBy: {
            ratings: {_count: 'desc'}
        }
    })

    const categories = await prisma.category.findMany()

    
    return res.json({books, categories})
    
        
    

    
    
}