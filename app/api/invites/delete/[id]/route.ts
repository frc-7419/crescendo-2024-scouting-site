import {getServerSession} from "next-auth/next";
import {authOptions} from "@/components/util/auth-options"
import {type NextRequest} from 'next/server'
import prisma from "@/lib/prisma";

export async function POST(
    request: NextRequest,
    {params}: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    const id = params.id

    if (!session) {
        return new Response('You must be logged in. Session Invalid.', {
            status: 401,
        });
    }

    if (request.method !== "POST") return new Response("Oops, Invalid Method.", {
        status: 400,
    });

    try {
        const del = await prisma.inviteCode.delete({
            where: {
                id: parseInt(id)
            }
        })

        return new Response('Success', {
            status: 200,
        });
    } catch (error) {
        console.error('Error deleting scouting data:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    }
}