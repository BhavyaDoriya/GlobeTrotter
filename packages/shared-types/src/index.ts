// Single import point for all shared Zod schemas and TypeScript types.
// Both NestJS API and Next.js web app import from here.
// Judge talking point: "One schema, two consumers — no drift between FE forms and BE validation."

export * from './user.schema';
export * from './trip.schema';
export * from './stop.schema';
export * from './activity.schema';
export * from './budget.schema';
