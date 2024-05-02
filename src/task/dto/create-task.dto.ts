import { IsString, IsNotEmpty } from "class-validator";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    TaskName: string;
  

    @IsString()
    @IsNotEmpty()
    description: string;

}
