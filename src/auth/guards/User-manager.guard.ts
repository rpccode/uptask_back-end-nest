import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable, BadRequestException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/user/Models/user.schema';
import { Proyect } from 'src/proyect/models/proyect.schema';


@Injectable()
export class UserManagerGuard implements CanActivate {
  
  constructor(
    private readonly reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
  
    
    const req = context.switchToHttp().getRequest();
    console.log(req)
    const user = req.user as User;
    const project = req.project as Proyect

    if ( !user ) 
      throw new BadRequestException('Usuario no encontrado');

    if(user.id !== project.manager )
      throw new ForbiddenException(
        `Usuario ${ user.firtsName +' '+ user.lastName } No es Manager en este proyecto`
      );
    
      return true
    
     
  }
}