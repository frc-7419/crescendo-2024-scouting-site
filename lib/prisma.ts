import {PrismaClient} from '@prisma/client'
import {withAccelerate} from "@prisma/extension-accelerate";

const prismaClient = () => {
    return new PrismaClient().$extends(withAccelerate())
}

declare global {
    var prisma: undefined | ReturnType<typeof prismaClient>
}

const prisma = globalThis.prisma ?? prismaClient()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma