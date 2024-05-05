import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { ProyectService } from './proyect.service';
import { CreateProyectDto } from './dto/create-proyect.dto';
import { UpdateProyectDto } from './dto/update-proyect.dto';
import { CreateTaskDto } from 'src/task/dto/create-task.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { GetProject } from 'src/common/decoretor/get-project/get-project.decorator';
import { Proyect } from './models/proyect.schema';
import { TaskService } from 'src/task/task.service';
import { UpdateTaskStatusDto } from 'src/task/dto/update-task-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/guards/get-user.decorator';
import { User } from 'src/user/Models/user.schema';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserManagerGuard } from 'src/auth/guards/User-manager.guard';

@Controller('project')
export class ProyectController {
  constructor(
    private readonly proyectService: ProyectService,
    private readonly taskService: TaskService,

  ) { }

  @Post()
  @Auth()
  create(
    @Body() createProyectDto: CreateProyectDto,
    @GetUser() user: User
  ) {
    return this.proyectService.create(createProyectDto, user);
  }


  @Post(':projectId/task')
  @Auth()
  async createTask(
    @Param('projectId', ParseMongoIdPipe) proyectId: string, 
    @Body() createTaskDto: CreateTaskDto,
    @GetProject() proyect:Proyect
  ) {
    // console.log(request)
    return this.proyectService.createTask(proyectId, createTaskDto);
  }

  @Get(':projectId/task')
  @Auth()

  async findAllTaskByProject(
    @GetProject() project: Proyect
  ) {
    return await this.taskService.findAllTaskByProject(project.id);;
  }

  @Get(':projectId/task/:TaskId')
  @Auth()
  async findTaskById(
    @Param('TaskId', ParseMongoIdPipe) id: string,
    @GetProject() project: Proyect
  ) {
    return await this.taskService.findOne(id, project.id);
  }

  @Put(':projectId/task/:TaskId')
  @Auth()
  async updateTaskByProject(
    @Param('TaskId', ParseMongoIdPipe) id: string,
    @GetProject() project: Proyect,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto
  ) {
    return await this.taskService.updateStatus(id, updateTaskStatusDto, project.id)
  }

  @Get()
  @Auth()
  findAll(
    @GetUser() user:User
  ) {
    return this.proyectService.findAll(user);
  }

  @Get(':proyectId')
  @Auth()
  findOne(
    @Param('proyectId', ParseMongoIdPipe) proyectId: string,
    @GetUser() user:User
  ) {
    return this.proyectService.findOne(proyectId,user);
  }

  @Put(':proyectId')
  @Auth()
  update(@Param('proyectId', ParseMongoIdPipe) proyectId: string, @Body() updateProyectDto: UpdateProyectDto) {
    return this.proyectService.update(proyectId, updateProyectDto);
  }

  @Delete(':proyectId')
  @Auth()
  remove(@Param('proyectId', ParseMongoIdPipe) proyectId: string) {
    return this.proyectService.remove(proyectId);
  }
}
