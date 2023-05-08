import { Reflector } from '@nestjs/core';
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities';
import { META_ROLES } from '../decorators';

@Injectable()
export class UseRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const valideRoles: string[] = this.reflector.get( META_ROLES, context.getHandler());
    
    if( !valideRoles ) return true; 
    if( valideRoles.length === 0 ) return true; 

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
 
    if( !user ) throw new BadRequestException('User not found');

    for ( const role of user.roles ) {
      if( valideRoles.includes( role ) ){
        return true;
      }
    };
    
    throw new ForbiddenException(`User ${ user.fullName } need a valid role [${ valideRoles }]`);
  }
}
