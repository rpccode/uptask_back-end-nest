import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskStatus, taskStatus } from './Models/task.schema';
import { proyect } from 'src/common/interfaces/proyect';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';


@Injectable()
export class TaskService {
  
  private readonly logger = new Logger('TaskService');
  constructor(
    @InjectModel(Task.name) private readonly TaskModel: Model<Task>,
  ) { }
  
  async create(id: string,createTaskDto: CreateTaskDto) {
    try {

      const newTask ={
        ...createTaskDto,
        proyect:id
      }
    
      const task = await this.TaskModel.create(newTask)
      
      
      return task
    } catch (error) {
      console.log(error)
      this.handleDBExceptions(error)
    }
  }

  async findAll() {
    try {
      const results = await this.TaskModel.find({ IsActive: true });
      if (results.length === 0) {
        return new NotFoundException('No hay Tareas activas en este momento').getResponse();
      }
      return results;
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }
  async  findAllTaskByProject(projectId:string) {
    try {
      const results = await this.TaskModel.find({ proyect: projectId }).populate('proyect');
      if (results.length === 0) {
        return new NotFoundException('No hay Tareas activos en este momento').getResponse();
      }
      return results;
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }
 
  async findOne(id: string,project:string) {
    const Id = id
    // console.log(Id)
    try {
      const results = await this.TaskModel.findById(id).where({ IsActive: true, proyect:project })

      if (!results) {
        return new NotFoundException(`No se encontró ningúna Tarea con el ID${id} proporcionado`).getResponse();
      }
      return results;

    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, projectId:string) {
    try {
    
      const task = await this.findOne(id, projectId)
      if (!task) {
        return new NotFoundException(`No se encontró ningúna Tarea con el ID${id} proporcionado para este Proyecto: ${projectId}`).getResponse();
      }
    
      const results = await this.TaskModel.findByIdAndUpdate(id, updateTaskDto,{ new:true})
      if (!results) {
        return new NotFoundException(`No se encontró ningúna Tarea con el ID${id} proporcionado`).getResponse();
      }
      return results;
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

 async updateStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto, projectId: string) {
    try {
    
      const task = await this.findOne(id, projectId)
      if (!task) {
        return new NotFoundException(`No se encontró ningúna Tarea con el ID${id} proporcionado para este Proyecto: ${projectId}`).getResponse();
      }
       
      const isTaskStatus = (value:string): boolean => Object.values(taskStatus).includes(value as TaskStatus);
      if(!isTaskStatus(updateTaskStatusDto.status)){
        return new NotFoundException(`El Estatus para esta tarea no es valido`).getResponse();
      }
    
      const results = await this.TaskModel.findByIdAndUpdate(id, updateTaskStatusDto,{ new:true})
      if (!results) {
        return new NotFoundException(`No se encontró ningúna Tarea con el ID${id} proporcionado`).getResponse();
      }
      return results;
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }
  async remove(id: string,projectId:string) {
    try {
      const results = await this.TaskModel.findById(id).where({ IsActive: true , proyect:projectId})

      if (!results) {
        return new NotFoundException(`No se encontró ningúna Tarea con el ID${id} proporcionado`).getResponse();
      }
      results.IsActive = false
      await results.save()

      return {
        message: "Tarea Eliminado Correctamente",
        error: "",
        statusCode: 200
      }
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }
  private handleDBExceptions(error: any) {

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
}
