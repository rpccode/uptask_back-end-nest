import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-auth.dto';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { tokenAuthDto } from './dto/token-auth.dto';
import { requestConfirmationCodeDto } from './dto/request-Confirmation-Code.dto';
import { UpdatePasswordDto } from './dto/Update-Password.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './guards/get-user.decorator';
import { User } from 'src/user/Models/user.schema';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService

  ) { }

  @Post('/login')
  async SingIn(@Body() loginUserDto: LoginUserDto) {
    // console.log(request)
    return this.authService.SingIn(loginUserDto)
  }

  @Get('/user')
  @UseGuards(AuthGuard())
  async GetUser(
    @GetUser() user: User
  ) {
    return user
  }

  @Put('/profile')
  @UseGuards(AuthGuard())
  async UpdateProfile(
    @GetUser() user: User,
    @Body() updateUser: UpdateUserDto
  ) {

    return this.authService.updateProfile(updateUser, user)
  }

  @Post('/register')
  async SingUp(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }
  
  @Post('/confirmed-account')
  async ConfirmedAcount(
    @Body() token: tokenAuthDto
  ) {
    return this.authService.confirmedAccount(token)
  }

  @Post('/reques-code')
  async RequestConfirmationCode(
    @Body() email: requestConfirmationCodeDto
  ) {
    return this.authService.requestConfirmationCode(email)
  }

  @Post('/forgot-password')
  async ForgotPassword(
    @Body() email: requestConfirmationCodeDto
  ) {
    return this.authService.forgotPassword(email)
  }


  @Post('/validate-token')
  async ValidateToken(
    @Body() token: tokenAuthDto
  ) {
    return this.authService.validateToken(token)
  }

  @Post('/update-password/:token')
  async UpdatePasswordWithPassword(
    @Param('token') token: string,
    @Body() password: UpdatePasswordDto
  ) {
    return this.authService.updatePasswordWithToken(token, password)
  }

}