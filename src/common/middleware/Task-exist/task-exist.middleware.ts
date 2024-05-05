import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction,Request,Response } from 'express';
import { Model } from 'mongoose';
import { Task, TaskDocument } from 'src/task/Models/task.schema';


@Injectable()
export class TaskExistsMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(Task.name) private readonly TaskModel: Model<TaskDocument>
  ){}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const {  TaskId } = req.params;

      const task = await this.TaskModel.findById(TaskId);


      // console.log("Entro al middleware")
      if (!task) {
        throw new NotFoundException('Task no encontrado');
      }
      req['task'] = task;
      // console.log("salio del middleware")
      next();
    } catch (error) {
      throw new NotFoundException('Task no encontrado');
    }
  }
}