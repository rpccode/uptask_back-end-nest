import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinLength } from "class-validator"

export class requestConfirmationCodeDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

}