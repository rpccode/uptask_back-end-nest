import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator"

export class CreateUserDto {

    @IsEmail()
    @IsNotEmpty()
    email: string
  
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword({
        minLength:8,
        minUppercase:1,
        minNumbers:1,
        minSymbols:1
    })
    password: string

    @IsNotEmpty()
    @IsString()
    firtsName: string

    @IsNotEmpty()
    @IsString()
    lastName: string
}
