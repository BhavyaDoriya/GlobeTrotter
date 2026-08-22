import { z } from 'zod';

export const CreateTripSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  coverPhotoUrl: z.string().url().optional(),
});

export const UpdateTripSchema = CreateTripSchema.partial();

export const TripStatusSchema = z.enum(['upcoming', 'ongoing', 'completed']);

export type CreateTripDto = z.infer<typeof CreateTripSchema>;
export type UpdateTripDto = z.infer<typeof UpdateTripSchema>;
export type TripStatus = z.infer<typeof TripStatusSchema>;
