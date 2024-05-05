import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinLength } from "class-validator"

export class tokenAuthDto {

    @IsNotEmpty()
    @MinLength(6)
    token: string

}