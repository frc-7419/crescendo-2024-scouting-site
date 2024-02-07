import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import  prisma from "@/lib/prisma";
import ScoutingSchedule from "@/lib/schemas";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (req.method !== "GET") return res.status(400).json({ message: "Oops" });

  const response = ScoutingSchedule.safeParse(req.body);

  if (!response.success) {
    const { errors } = response.error;

    return res.status(400).json({
      error: {
        message: "Invalid",
        errors,
      },
    });
  }
/* 
  const result = await prisma.scoutingSchedule.create({
    data: {

    },
    include: {
      user: true,
    },
  }); 

  return res.json(result);
  */
}