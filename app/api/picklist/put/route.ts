import {getServerSession} from "next-auth/next";
import {authOptions} from "@/components/util/auth-options";
import prisma from "@/lib/prisma";
import {getCurrentEvent} from "@/components/util/getCurrentEvent";

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
        const venue = getCurrentEvent()
        await prisma.picklist.deleteMany({
            where: {
                venue: venue
            }
        });

        for (const picklist of json) {
            const index: number = json.indexOf(picklist);
            await prisma.picklist.create({
                data: {
                    teamNumber: picklist.teamNumber,
                    venue,
                    position: index
                }
            });
        }

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