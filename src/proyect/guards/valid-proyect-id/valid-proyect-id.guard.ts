import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ValidProyectIdGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const req = context.switchToHttp().getRequest()
    // console.log(req)
    const proyectId = req.project
    // console.log("Entro al guard")
    if(!proyectId) throw new NotFoundException('Proyecto no encontrado');
    // console.log("salio del guard")
    return true;
  }
}
