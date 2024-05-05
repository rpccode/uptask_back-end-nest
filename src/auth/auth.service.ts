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
import { tokenAuthDto } from './dto/token-auth.dto';
import { requestConfirmationCodeDto } from './dto/request-Confirmation-Code.dto';
import { hashPassword } from 'src/common/helpers/hashPassword';
import { UpdatePasswordDto } from './dto/Update-Password.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
    @InjectModel(Token.name) private readonly TokenModel: Model<Token>,
    private readonly sendMail: SendEmailService,
    private readonly userService: UserService
  ) { }

  async SingIn(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.UserModel.findOne({ email });

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    if (!user.IsConfirmed) {
      const token = await this.TokenModel.create({
        token: generateToken(),
        user: user.id
      })

      this.sendMail.SendConfirmationEmail({
        email: user.email,
        name: user.firtsName + ' ' + user.lastName,
        token: token.token
      })



      throw new BadRequestException('La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmación').getResponse()
    }


    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');

    return {
      user,
      token: this.userService.getJwtToken({ id: user.id, email: user.email })
    };
  }
  async confirmedAccount(token: tokenAuthDto) {
    try {

      const existToken = await this.TokenModel.findOne({ token: token.token })
      if (!token) throw new NotFoundException('Token no valido')

      const user = await this.UserModel.findById(existToken.user)
      user.IsConfirmed = true;
      await Promise.allSettled([user.save(), existToken.deleteOne()])
      return {
        ok: true,
        msg: 'Cuenta confirmada correctamente'
      }
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async requestConfirmationCode(email: requestConfirmationCodeDto) {
    try {

      // Usuario existe
      const user = await this.UserModel.findOne({ email: email.email })
      // console.log(user)
      if (!user)
        throw new BadRequestException('El Usuario no esta registrado').getResponse()


      if (user.IsConfirmed)
        throw new BadRequestException('El Usuario ya esta confirmado').getResponse()


      // Generar el token
      const token = new Token()
      token.token = generateToken()
      token.user = user.id

      // enviar el email
      this.sendMail.SendConfirmationEmail({
        email: user.email,
        name: user.firtsName + ' ' + user.lastName,
        token: token.token
      })

      await Promise.allSettled([user.save(), token.save()])

      return { ok: true, msg: 'Se envió un nuevo token a tu e-mail' }
    } catch (error) {
      // console.log(error)
      this.handleDBExceptions(error)
    }
  }
  async forgotPassword(email: requestConfirmationCodeDto) {
    try {

      // Usuario existe
      const user = await this.UserModel.findOne({ email: email.email })
      // console.log(user)
      if (!user)
        throw new BadRequestException('El Usuario no esta registrado').getResponse()


      // Generar el token
      const token = await this.TokenModel.create({
        token: generateToken(),
        user: user.id
      })

      // enviar el email
      this.sendMail.sendPasswordResetToken({
        email: user.email,
        name: user.firtsName + ' ' + user.lastName,
        token: token.token
      })
      return { ok: true, msg: 'Revisa tu email para instrucciones' }
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async validateToken(token: tokenAuthDto) {
    try {

      const tokenExists = await this.TokenModel.findOne({ token: token.token })
      if (!tokenExists)
        throw new BadRequestException('Token no válido').getResponse()


      return { ok: true, msg: 'Token válido, Define tu nuevo password' }

    } catch (error) {
      // console.log(error)
      this.handleDBExceptions(error)
    }
  }

  async updatePasswordWithToken(token: string, password: UpdatePasswordDto) {
    try {

      const tokenExists = await this.TokenModel.findOne({ token })
      if (!tokenExists)
        throw new BadRequestException('Token no válido')


      const user = await this.UserModel.findById(tokenExists.user)
      user.password = await hashPassword(password.password)

      await Promise.allSettled([user.save(), tokenExists.deleteOne()])

      return { ok: true, msg: 'El password se modificó correctamente' }

    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async updateProfile(updateUser: UpdateUserDto, user: User) {

    const userExists = await this.UserModel.findOne({ email: user.email })
    if (userExists && userExists.id.toString() !== user.id.toString()) {
      throw new BadRequestException('Ese email ya esta registrado')
    }

     await userExists.updateOne(updateUser, { new: true })
    
    try {
      return { ok: true, msg: 'Perfil actualizado correctamente',userExists }
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }
  private handleDBExceptions(error: any) {
    // console.log(error.statusCode)
    if (error.statusCode === 400)
      throw new BadRequestException(error);

    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }

}

