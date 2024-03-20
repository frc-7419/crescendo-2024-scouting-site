import {getServerSession} from "next-auth/next";
import {authOptions} from "@/components/util/auth-options";
import prisma from "@/lib/prisma";

async function generateUniqueInviteCode(team: string) {
    const prefix = team.slice(0, 4);

    let code;
    let isUnique = false;

    while (!isUnique) {
        const randomChars = Math.random().toString(36).substring(4, 8);
        code = (prefix + randomChars).toUpperCase();

        const existingCode = await prisma.inviteCode.findUnique({
            where: {
                code: code
            }
        });

        if (!existingCode) {
            isUnique = true;
        }
    }

    return code;
}


export async function POST(
    request: Request,
) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new Response('You must be logged in. Session Invalid.', {
            status: 401,
        })
    }

    if (request.method !== "POST") return new Response("Oops, Invalid Method.", {
        status: 400,
    })

    try {
        const json = await request.json();
        const team = json.team;
        const code = await generateUniqueInviteCode(team)
        await prisma.inviteCode.create({
            data: {
                team: team,
                code: String(code)
            }
        });

        return new Response('Success', {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response(String(error), {
            status: 500,
        });
    }
}