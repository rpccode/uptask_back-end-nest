import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task, TaskSchema } from './Models/task.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { NotesService } from './notes/notes.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema}]),
  ],
  controllers: [TaskController],
  providers: [TaskService, NotesService],
  exports: [TaskService,MongooseModule]
})
export class TaskModule {}
