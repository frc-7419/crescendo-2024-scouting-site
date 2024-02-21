import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { type NextRequest } from 'next/server'
import prisma from "@/lib/prisma";
import { Match } from "@/types/match";
import { Scouter } from "@/types/schedule";

const getScoutedTeam = (match: Match, shift: Scouter) => {
    let team;
    let alliance;
    if (shift) {
        console.log(shift.role)
        switch (shift.role as string) {
            case "BLUEONE":
                team = match.alliances.blue.team_keys[0];
                alliance = "BLUE";
                break;
            case "BLUETWO":
                team = match.alliances.blue.team_keys[1];
                alliance = "BLUE";
                break;
            case "BLUETHREE":
                team = match.alliances.blue.team_keys[2];
                alliance = "BLUE";
                break;
            case "REDONE":
                team = match.alliances.red.team_keys[0];
                alliance = "RED";
                break;
            case "REDTWO":
                team = match.alliances.red.team_keys[1];
                alliance = "RED";
                break;
            case "REDTHREE":
                team = match.alliances.red.team_keys[2];
                alliance = "RED";
                break;
        }
    }
    const scoutedTeam = {
        team: team?.replace("frc", ""),
        alliance: alliance
    };

    return scoutedTeam

}

export async function GET(
    request: NextRequest,
) {
    const session = await getServerSession(authOptions);

    const searchParams = request.nextUrl.searchParams
    const matchId = searchParams.get('matchId') as string;

    if (!session) {
        return new Response('You must be logged in. Session Invalid.', {
            status: 401,
        });
    }

    if (request.method !== "GET") return new Response("Oops, Invalid Method.", {
        status: 400,
    });

    const form = await prisma.scouter.findFirst({
        where: {
            scouterId: session?.user?.id,
            ScoutingSchedule: {
                matchID: matchId,
            },
        },
        include: {
            ScoutingSchedule: true,
        },
    });

    if (!form) {
        return new Response('No form found.', {
            status: 404,
        });
    }

    const formData = {
        matchID: form.ScoutingSchedule?.matchID,
        matchNumber: form.ScoutingSchedule?.matchNumber,
        venue: form.ScoutingSchedule?.venue,
        scouterId: form.scouterId,
        role: form.role,
    };

    try {
        const response = await fetch(`https://www.thebluealliance.com/api/v3/match/${matchId}/simple`, {
            headers: new Headers({
                'X-TBA-Auth-Key': process.env.BLUEALLIANCE_API_KEY || ''
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const team = getScoutedTeam(data, formData);

        const scoutData = {
            matchId: formData.matchID,
            matchNumber: formData.matchNumber,
            venue: formData.venue,
            scouterId: formData.scouterId,
            role: formData.role,
            team: team.team,
            alliance: team.alliance,
        };

        const responseBody = JSON.stringify(scoutData);
        const headers = {
            'Content-Type': 'application/json',
            'Content-Length': responseBody.length.toString(),
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