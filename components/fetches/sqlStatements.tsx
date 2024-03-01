import {Prisma} from "@prisma/client";

export function getAverages(teamNumber: string, venue: string) {
    return (Prisma.sql`
    SELECT
    ROUND(AVG(a.amp), 2) AS avgAmpAuton,
    ROUND(AVG(a.speaker), 2) AS avgSpeakerAuton,
    ROUND(AVG(t.amp), 2) AS avgAmpTeleop,
    ROUND(AVG(t.speaker), 2) AS avgSpeakerTeleop,
    ROUND(AVG(t."timesAmped"), 2) AS avgTimesAmped,
    ROUND(AVG(t.trap), 2) AS avgTrap,
    ROUND(AVG(m.defense), 2) AS avgDefense,
    ROUND(AVG(m.reliability), 2) AS avgReliability
FROM
    "ScoutingData" sd 
LEFT JOIN "Auton" a  ON sd."autonId"  = a.id
LEFT JOIN "Teleop" t  ON sd."teleopId"  = t.id
LEFT JOIN "Misc" m  ON sd."miscId"  = m.id
WHERE
    sd."teamNumber"  = ${teamNumber}
    AND sd.venue = ${venue}
    `
    )
}