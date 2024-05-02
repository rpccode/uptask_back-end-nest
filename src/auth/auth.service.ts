import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/Models/user.schema';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { Token } from 'src/user/Models/Token.schema';
import { generateToken } from 'src/common/helpers/generateToken';
import { SendEmailService } from 'src/send-email/send-email.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
 
    constructor(
      @InjectModel(User.name) private readonly UserModel: Model<User>,
      @InjectModel(Token.name) private readonly TokenModel: Model<Token>,
      private readonly sendMail : SendEmailService,
      private readonly userService: UserService
    ){}

  async SingIn(loginUserDto:LoginUserDto){
    const { password, email } = loginUserDto;

    const user = await this.UserModel.findOne({email});

    if ( !user ) 
      throw new UnauthorizedException('Credentials are not valid (email)');

    if(!user.IsConfirmed){
      const token = await this.TokenModel.create({
        token: generateToken(),
        user:user.id
      })

      this.sendMail.SendConfirmationEmail({
        email: user.email,
        name: user.firtsName + ' '+ user.lastName,
        token:token.token
      })



      throw new BadRequestException('La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmación')
    }

      
    if ( !bcrypt.compareSync( password, user.password ) )
      throw new UnauthorizedException('Credentials are not valid (password)');

    return {
      user,
      token: this.userService.getJwtToken({ id: user.id , email:user.email})
    };
  }  
 async confirmedPassword(token:string){
  try {
    const existToken = await this.TokenModel.findOne({token})
    if(!token) throw new NotFoundException('Token no valido')
    
      const user = await this.UserModel.findById(existToken.user)
      user.IsConfirmed = true;
      await Promise.allSettled([user.save(),existToken.deleteOne()])

  } catch (error) {
    this.handleDBExceptions(error)
  }
  }

  private handleDBExceptions(error: any) {

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
  
  }

