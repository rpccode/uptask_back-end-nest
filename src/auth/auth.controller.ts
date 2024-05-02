import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-auth.dto';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  
  ) {}

  @Post('/login')
  async SingIn(@Body() loginUserDto:LoginUserDto ){
    // console.log(request)
    return this.authService.SingIn(loginUserDto)
  }

  @Post('/register')
  async SingUp(@Body() createUserDto:CreateUserDto ){
   return this.userService.create(createUserDto)
  }
@Post('/confirmed-account')
async ConfirmedAcount(){

}

@Post('/reques-code')
async  RequestConfirmationCode(){}

@Post('/forgot-password')
async ForgotPassword(){}
  

@Post('/validate-token')
async ValidateToken(){}

@Post('/update-password/:token')
async UpdatePasswordWithPassword(){}

}