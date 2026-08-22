import { z } from 'zod';

export const BudgetCategorySchema = z.enum([
  'TRANSPORT',
  'STAY',
  'ACTIVITIES',
  'MEALS',
  'OTHER',
]);

export const CreateBudgetLineSchema = z.object({
  category: BudgetCategorySchema,
  label: z.string().min(1),
  amount: z.number().min(0),
  stopId: z.string().optional(),
});

export type BudgetCategory = z.infer<typeof BudgetCategorySchema>;
export type CreateBudgetLineDto = z.infer<typeof CreateBudgetLineSchema>;
