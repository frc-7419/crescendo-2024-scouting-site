import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Match } from "@/types/match";

export async function GET(
  request: Request,
  { params }: { params: { event: string } }
) {
  const session = await getServerSession(authOptions)
  const event = params.event

  if (!session) {
    return new Response('You must be logged in. Session Invalid.', {
      status: 401,
    })
  }

  if (request.method !== "GET") return new Response("Oops, Invalid Method.", {
    status: 400,
  })

  try {
    const response = await fetch(`https://www.thebluealliance.com/api/v3/event/${event}/matches/simple`, {
      headers: new Headers({
        'X-TBA-Auth-Key': 'h2zoQFRZDrANaEitRZzA0pZfM3kiUqGaNMqmh49un8KFUB27GnbAphMc9VLmDYD5'
      }),
      next: { revalidate: 30 }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const sortedMatches = data.sort((a: Match, b: Match) => a.predicted_time - b.predicted_time);

    return Response.json(sortedMatches);
  } catch (error) {
    console.error(error);
    return new Response(String(error), {
      status: 500,
    })
  }
}