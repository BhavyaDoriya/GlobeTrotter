import { z } from 'zod';

export const AssignActivitySchema = z.object({
  activityId: z.string().min(1),
  scheduledDate: z.string().datetime().optional(),
  scheduledTime: z.string().optional(),
});

export const UpdateStopActivitySchema = z.object({
  scheduledDate: z.string().datetime().optional(),
  scheduledTime: z.string().optional(),
  actualCost: z.number().min(0).optional(),
});

export type AssignActivityDto = z.infer<typeof AssignActivitySchema>;
export type UpdateStopActivityDto = z.infer<typeof UpdateStopActivitySchema>;
