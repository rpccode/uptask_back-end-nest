import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { GetProject } from 'src/common/decoretor/get-project/get-project.decorator';
import { proyect } from 'src/common/interfaces/proyect';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService
  ) {}

  @Post(':proyectId')
  create(@Param('proyectId', ParseMongoIdPipe) proyectId: string, @Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(proyectId,createTaskDto);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }
  @Get(':proyectId')
  findAllTaskByProject(@Param('proyectId', ParseMongoIdPipe) proyectId:string ){
    return this.taskService.findAllTaskByProject(proyectId);
  }
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string,@GetProject() project:proyect) {
    return this.taskService.findOne(id,project.id);
  }

  @Patch(':id')
  update(@Param('id', ParseMongoIdPipe) id: string, @Body() updateTaskDto: UpdateTaskDto,@GetProject() project:proyect) {
    return this.taskService.update(id, updateTaskDto,project.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string,@GetProject() project:proyect) {
    return this.taskService.remove(id,project.id);
  }
}
