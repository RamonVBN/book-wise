import { PrismaClient } from "../generated/prisma/index";


export const prisma = new PrismaClient(
    {
        log: ['error', 'query', 'info']
    }
)