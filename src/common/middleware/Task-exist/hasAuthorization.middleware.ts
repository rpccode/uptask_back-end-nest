import { Injectable, NestMiddleware, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction,Request,Response } from 'express';
import { Model } from 'mongoose';
import { Task, TaskDocument } from 'src/task/Models/task.schema';


// @Injectable()
// export class hasAuthorizationMiddleware implements NestMiddleware {
//   constructor(
//     @InjectModel(Task.name) private readonly TaskModel: Model<TaskDocument>
//   ){}
//   async use(req: Request, res: Response, next: NextFunction) {
//     // console.log(req)
//     const {id} = req.user
//     const {id} = req.project

//     if( req.user.id.toString() !== req.project.manager.toString() ) {
//         throw new UnauthorizedException('Acción no válida')
//     }
//     next()
//   }
// }