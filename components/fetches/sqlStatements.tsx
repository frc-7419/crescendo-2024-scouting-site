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
    ROUND(AVG(m.reliability), 2) AS avgReliability,
    (
        SELECT t.intake
        FROM "ScoutingData" sd
        LEFT JOIN "Teleop" t ON sd."teleopId" = t.id
        WHERE sd."teamNumber" = ${teamNumber} AND sd.venue = ${venue}
        GROUP BY t.intake
        ORDER BY COUNT(*) DESC
        LIMIT 1
    ) AS intake,
    (
        SELECT t."isHanging"
        FROM "ScoutingData" sd
        LEFT JOIN "Teleop" t ON sd."teleopId" = t.id
        WHERE sd."teamNumber" = ${teamNumber} AND sd.venue = ${venue}
        GROUP BY t."isHanging"
        ORDER BY COUNT(*) DESC
        LIMIT 1
    ) AS hang,
    (
        SELECT t."pickupFrom"
        FROM "ScoutingData" sd
        LEFT JOIN "Teleop" t ON sd."teleopId" = t.id
        WHERE sd."teamNumber" = ${teamNumber} AND sd.venue = ${venue}
        GROUP BY t."pickupFrom"
        ORDER BY COUNT(*) DESC
        LIMIT 1
    ) AS pickup
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

export function getBests(teamNumber: string, venue: string) {
    return (Prisma.sql`
    SELECT
    (
        SELECT a.amp
        FROM "ScoutingData" sd
        LEFT JOIN "Auton" a ON sd."autonId" = a.id
        WHERE sd."teamNumber" = ${teamNumber} AND sd.venue = ${venue}
        GROUP BY a.amp, a.speaker
        ORDER BY CONCAT(a.amp, a.speaker) DESC
    LIMIT 1
	) AS ampAuton,
    (
        SELECT a.speaker
        FROM "ScoutingData" sd
        LEFT JOIN "Auton" a ON sd."autonId" = a.id
        WHERE sd."teamNumber" = ${teamNumber} AND sd.venue = ${venue}
        GROUP BY a.amp, a.speaker
        ORDER BY CONCAT(a.amp, a.speaker) DESC
        LIMIT 1
	) AS speakerAuton,
    (
        SELECT t.amp
        FROM "ScoutingData" sd
        LEFT JOIN "Teleop" t ON sd."teleopId" = t.id
        WHERE sd."teamNumber" = ${teamNumber} AND sd.venue = ${venue}
        GROUP BY t.amp, t.speaker
        ORDER BY CONCAT(t.amp, t.speaker) DESC
        LIMIT 1
    ) AS ampTeleop,
    (
        SELECT t.speaker
        FROM "ScoutingData" sd
        LEFT JOIN "Teleop" t ON sd."teleopId" = t.id
        WHERE sd."teamNumber" = ${teamNumber} AND sd.venue = ${venue}
        GROUP BY t.amp, t.speaker
        ORDER BY CONCAT(t.amp, t.speaker) DESC
        LIMIT 1
    ) AS speakerTeleop,
    MAX(t."timesAmped") AS timesAmped,
    MAX(t.trap) AS trap,
    MAX(m.defense) AS defense,
    MAX(m.reliability) reliability,
    (
        SELECT t.intake
        FROM "ScoutingData" sd
        LEFT JOIN "Teleop" t ON sd."teleopId" = t.id
        WHERE sd."teamNumber" = ${teamNumber} AND sd.venue = ${venue}
        GROUP BY t.intake
        ORDER BY COUNT(*) DESC
        LIMIT 1
    ) AS intake,
    (
        SELECT t."isHanging"
        FROM "ScoutingData" sd
        LEFT JOIN "Teleop" t ON sd."teleopId" = t.id
        WHERE sd."teamNumber" = ${teamNumber} AND sd.venue = ${venue}
        GROUP BY t."isHanging"
        ORDER BY COUNT(*) DESC
        LIMIT 1
    ) AS hang,
    (
        SELECT t."pickupFrom"
        FROM "ScoutingData" sd
        LEFT JOIN "Teleop" t ON sd."teleopId" = t.id
        WHERE sd."teamNumber" = ${teamNumber} AND sd.venue = ${venue}
        GROUP BY t."pickupFrom"
        ORDER BY COUNT(*) DESC
        LIMIT 1
    ) AS pickup
    FROM
        "ScoutingData" sd 
    LEFT JOIN "Auton" a  ON sd."autonId"  = a.id
    LEFT JOIN "Teleop" t  ON sd."teleopId"  = t.id
    LEFT JOIN "Misc" m  ON sd."miscId"  = m.id
    WHERE
        sd."teamNumber"  = ${teamNumber}
        AND sd.venue = ${venue}
    `
    );
}
