import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsNotEmpty, IsString } from 'class-validator';


export class UpdateTaskStatusDto extends PartialType(CreateTaskDto) {
    @IsNotEmpty()
    @IsString()
    status:string
}
