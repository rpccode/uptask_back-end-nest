import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsNotEmpty, IsString } from "class-validator";

export class CreateProyectDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Api en Nest Para tareas' }) 
  ProyectName: string;

  @IsString()
  @ApiProperty({ example: 'johndoe' }) 
  clientName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'johndoe' }) 
  description: string;
}
