import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // HTTP context
    const httpReq = ctx.switchToHttp()?.getRequest();
    if (httpReq) return httpReq.headers['user-agent'] ?? '';

    // TCP context
    const payload = ctx.switchToRpc()?.getData();
    console.log('🚀 ~ payload:', payload);
    return payload?.data?.userAgent ?? '';
  }
);
