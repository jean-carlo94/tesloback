import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";

export const GetUser = createParamDecorator(
    ( data: string, ctx: ExecutionContext ) => {
        
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        if( !user ) throw new InternalServerErrorException('User not found (request)');

        if( data ){
            if ( !user[data] ) throw new InternalServerErrorException('Property not exist (request)');           
            return user[data];
        };

        return user;
    }
);