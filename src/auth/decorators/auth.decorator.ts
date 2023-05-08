import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ValideRoles } from '../interfaces';
import { RoleProtected } from './role-protected.decorator';
import { UseRoleGuard } from '../guards/use-role.guard';

export function Auth(...roles: ValideRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UseRoleGuard),
  );
}