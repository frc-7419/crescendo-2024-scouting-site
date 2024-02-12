import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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

    return Response.json(users);
  } catch (error) {
    console.error(error);
    return new Response(String(error), {
      status: 500,
    })
  }
}