import { z } from 'zod';

export const CreateStopSchema = z.object({
  cityId: z.string().min(1),
  arrivalDate: z.string().datetime(),
  departureDate: z.string().datetime(),
});

export const UpdateStopSchema = CreateStopSchema.partial().omit({ cityId: true });

export const ReorderStopsSchema = z.object({
  stops: z.array(z.object({
    id: z.string(),
    orderIndex: z.number().int().min(0),
  })),
});

export type CreateStopDto = z.infer<typeof CreateStopSchema>;
export type UpdateStopDto = z.infer<typeof UpdateStopSchema>;
export type ReorderStopsDto = z.infer<typeof ReorderStopsSchema>;
