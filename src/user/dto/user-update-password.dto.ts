import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator"

export class UserUpdatePasswordDto {

  
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
    @IsStrongPassword({
        minLength:8,
        minUppercase:1,
        minNumbers:1,
        minSymbols:1
    })
    current_password: string

   
}
