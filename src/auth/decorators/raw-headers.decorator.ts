import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export const RawHeaders = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const response = ctx.switchToHttp().getRequest();
        return response.rawHeaders;
    }
)