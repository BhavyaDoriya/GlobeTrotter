# Dockerfile for NestJS API (apps/api)
FROM node:20-alpine AS base
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy root monorepo configs
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared-types/package.json ./packages/shared-types/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/api ./apps/api
COPY packages/shared-types ./packages/shared-types

# Generate Prisma Client
RUN cd apps/api && npx prisma generate

# Build API
RUN pnpm --filter api build

EXPOSE 3001

CMD ["sh", "-c", "cd apps/api && npx prisma migrate deploy && pnpm run start:prod"]
