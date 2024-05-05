import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinLength } from "class-validator"

export class UpdatePasswordDto {

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword({
        minLength:8,
        minUppercase:1,
        minNumbers:1,
        minSymbols:1
    })
    password: string

}