import { TeamRole } from '@prisma/client';
import { z } from 'zod';

const Scouter = z.object({
  id: z.number().int().optional(),
  scouterId: z.string(),
  role: z.nativeEnum(TeamRole),
  scoutingScheduleId: z.number().int().optional(),
});

const ScoutingSchedule = z.object({
  id: z.number().int().optional(),
  matchNumber: z.number().int(),
  matchID: z.string(),
  venue: z.string(),
  scouters: z.array(Scouter),
});

export default ScoutingSchedule;