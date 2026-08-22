import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Use @CurrentUser() in controller params to get the logged-in user
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().user;
  },
);
