import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateProyectDto } from './dto/create-proyect.dto';
import { UpdateProyectDto } from './dto/update-proyect.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Proyect, ProyectDocument } from './models/proyect.schema';
import { CreateTaskDto } from 'src/task/dto/create-task.dto';
import { TaskService } from 'src/task/task.service';
import { User } from 'src/user/Models/user.schema';


@Injectable()
export class ProyectService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    private readonly taskService: TaskService,
    @InjectModel(Proyect.name) private readonly proyectModel: Model<ProyectDocument>
  ) { }


  async create(createProyectDto: CreateProyectDto, user: User) {

    try {
      const proyect = await this.proyectModel.create(createProyectDto)
      proyect.manager = user.id
      proyect.save()
      return proyect
    } catch (error) {
      console.log(error)
      this.handleDBExceptions(error)
    }
  }
  async createTask(id: string, createTaskDto: CreateTaskDto) {

    try {
      const results = await this.proyectModel.findById(id).where({ IsActive: true })

      if (!results) {
        return new NotFoundException('No se encontró ningún proyecto con el ID proporcionado').getResponse();
      }
      const task = await this.taskService.create(id, createTaskDto,results)
      if (!task) {
        return new BadRequestException('No se encontró ningún proyecto con el ID proporcionado').getResponse();
      }
      results.tasks.push(task.id)
      results.save()
      return task
    } catch (error) {
      console.log(error)
      this.handleDBExceptions(error)
    }
  }
  async findAll(user: User) {
    try {
      const results = await this.proyectModel.find({
        IsActive: true,
        $or: [
          { manager: { $in: [user.id] } },
          { team: { $in: [user.id] } }
        ]
      })
      if (results.length === 0) {
        return new NotFoundException('No hay Proyectos activos en este momento').getResponse();
      }
      return results;
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }
  async findOne(id: string, user: User) {
    try {
      const project = await (await this.proyectModel.findById(id).where({ IsActive: true })).populate('tasks');

      if (!project) {
        return new NotFoundException('No se encontró ningún proyecto con el ID proporcionado').getResponse();
      }
      if (project.manager.toString() !== user.id.toString() && !project.team.includes(user.id)) {
        return new UnauthorizedException('Acción no válida')
      }
      return project;

    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async update(id: string, updateProyectDto: UpdateProyectDto) {
    try {
      const Id = id
      // console.log(Id)
      const results = await this.proyectModel.findByIdAndUpdate(id, updateProyectDto)
      if (!results) {
        return new NotFoundException('No se encontró ningún proyecto con el ID proporcionado').getResponse();
      }
      return results;
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async remove(id: string) {
    try {
      const results = await this.proyectModel.findById(id).where({ IsActive: true })

      if (!results) {
        return new NotFoundException('No se encontró ningún proyecto con el ID proporcionado').getResponse();
      }
      results.IsActive = false
      await results.save()

      return {
        message: "Proyecto Eliminado Correctamente",
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
