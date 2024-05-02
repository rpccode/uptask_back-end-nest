import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, Put, NotFoundException, Req, UseGuards } from '@nestjs/common';
import { ProyectService } from './proyect.service';
import { CreateProyectDto } from './dto/create-proyect.dto';
import { UpdateProyectDto } from './dto/update-proyect.dto';
import { CreateTaskDto } from 'src/task/dto/create-task.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { ValidProyectIdGuard } from './guards/valid-proyect-id/valid-proyect-id.guard';
import { GetProject } from 'src/common/decoretor/get-project/get-project.decorator';
import { Proyect } from './entities/proyect.schema';
import { TaskService } from 'src/task/task.service';
import { UpdateTaskDto } from 'src/task/dto/update-task.dto';
import { UpdateTaskStatusDto } from 'src/task/dto/update-task-status.dto';

@Controller('project')
export class ProyectController {
  constructor(
    private readonly proyectService: ProyectService,
    private readonly taskService: TaskService,
  
  ) {}

  @Post()
  create(@Body() createProyectDto: CreateProyectDto) {
    return this.proyectService.create(createProyectDto);
  }
  @Post(':projectId/task')
  async createTask(@Param('projectId', ParseMongoIdPipe) proyectId: string,@Body() createTaskDto: CreateTaskDto) {
    // console.log(request)
    return this.proyectService.createTask(proyectId,createTaskDto) ;
  }
  @Get(':projectId/task')
  async findAllTaskByProject(
    @GetProject() project: Proyect
  ) {
    return await this.taskService.findAllTaskByProject(project.id); ;
  }
  @Get(':projectId/task/:TaskId')
  async findTaskById(
    @Param('TaskId', ParseMongoIdPipe) id: string,
    @GetProject() project: Proyect
  ) {
    return await this.taskService.findOne(id,project.id);
  }
  @Put(':projectId/task/:TaskId')
  async updateTaskByProject(
    @Param('TaskId', ParseMongoIdPipe) id: string,
    @GetProject() project: Proyect,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto
  ){
    return await this.taskService.updateStatus(id,updateTaskStatusDto,project.id)
  }

  @Get()
  findAll() {
    return this.proyectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.proyectService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseMongoIdPipe) id: string, @Body() updateProyectDto: UpdateProyectDto) {
    return this.proyectService.update(id, updateProyectDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.proyectService.remove(id);
  }
}
