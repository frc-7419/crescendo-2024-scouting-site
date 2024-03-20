import {getServerSession} from "next-auth/next";
import {authOptions} from "@/components/util/auth-options"
import {type NextRequest} from 'next/server'
import prisma from "@/lib/prisma";

export async function GET(
    request: NextRequest,
) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new Response('You must be logged in. Session Invalid.', {
            status: 401,
        });
    }


    if (request.method !== "GET") return new Response("Oops, Invalid Method.", {
        status: 400,
    });

    try {
        const codes = await prisma.inviteCode.findMany()
        return new Response(JSON.stringify(codes), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error retrieving invite codes:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    }
}