import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction,Request,Response } from 'express';
import { Model } from 'mongoose';
import { Proyect, ProyectDocument } from 'src/proyect/models/proyect.schema';
import { ProyectService } from 'src/proyect/proyect.service';

@Injectable()
export class ProjectExistsMiddleware implements NestMiddleware {
  constructor(
    private readonly proyectService: ProyectService,
    @InjectModel(Proyect.name) private readonly proyectModel: Model<ProyectDocument>
  ){}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const project = await this.proyectModel.findById(projectId);
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