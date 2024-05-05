import { Module } from '@nestjs/common';
import { ProyectService } from './proyect.service';
import { ProyectController } from './proyect.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Proyect, ProyectSchema } from './models/proyect.schema';
import { TaskModule } from 'src/task/task.module';
import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Proyect.name, schema: ProyectSchema }]),
    TaskModule,
    PassportModule
  ],
  controllers: [ProyectController],
  providers: [ProyectService],
  exports:[ProyectService,MongooseModule]
})
export class ProyectModule { }
