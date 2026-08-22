import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// Use @Public() on any route that should skip JWT auth (e.g. login, register)
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
