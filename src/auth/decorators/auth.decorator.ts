import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserManagerGuard } from '../guards/User-manager.guard';
// import { UserRoleGuard } from '../guards/user-role.guard';
// import { ValidRoles } from '../interfaces';
// import { RoleProtected } from './role-protected.decorator';


export function Auth() {

  return applyDecorators(
    // RoleProtected(...roles),
    UseGuards( AuthGuard('jwt'), UserManagerGuard ),
  );

}