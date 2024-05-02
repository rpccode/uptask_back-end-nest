import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { NextFunction,Request,Response } from 'express';
import { ProyectService } from 'src/proyect/proyect.service';

@Injectable()
export class ProjectExistsMiddleware implements NestMiddleware {
  constructor(
    private readonly proyectService: ProyectService,
  ){}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const project = await this.proyectService.findOne(projectId);
      // console.log("Entro al middleware")
      if (!project) {
        throw new NotFoundException('Proyecto no encontrado');
      }
      req['project'] = project;
      // console.log("salio del middleware")
      next();
    } catch (error) {
      throw new NotFoundException('Proyecto no encontrado');
    }
  }
}