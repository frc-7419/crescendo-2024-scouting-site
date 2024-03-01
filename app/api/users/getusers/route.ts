import {getServerSession} from "next-auth/next";
import {authOptions} from "@/components/util/auth-options";
import prisma from "@/lib/prisma";

export async function GET(
    request: Request,
) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new Response('You must be logged in. Session Invalid.', {
            status: 401,
        })
    }

    if (request.method !== "GET") return new Response("Oops, Invalid Method.", {
        status: 400,
    })

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        const responseBody = JSON.stringify(users);
        const headers = {
            'Content-Type': 'application/json',
            'Content-Length': responseBody.length.toString(),
            'Cache-Control': 'public, s-maxage=60',
            'CDN-Cache-Control': 'public, s-maxage=300',
            'Vercel-CDN-Cache-Control': 'public, s-maxage=1800',
        };

        return new Response(responseBody, {
            status: 200,
            headers: headers,
        });
    } catch (error) {
        console.error(error);
        return new Response(String(error), {
            status: 500,
        })
    }
}