import { SetMetadata } from '@nestjs/common';
import { ValideRoles } from '../interfaces';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: ValideRoles[]) => {
    return SetMetadata(META_ROLES, args);
}
