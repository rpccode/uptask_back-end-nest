import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './Models/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { Token } from 'src/user/Models/Token.schema';
import { generateToken } from 'src/common/helpers/generateToken';
import { SendEmailService } from 'src/send-email/send-email.service';
import { hashPassword } from 'src/common/helpers/hashPassword';
import { UserUpdatePasswordDto } from './dto/user-update-password.dto';
import { checkPassword } from 'src/common/helpers/checkPassword';

@Injectable()
export class UserService {

  private readonly logger = new Logger('UserService');
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
    @InjectModel(Token.name) private readonly TokenModel: Model<Token>,
    private readonly jwtService: JwtService,
    private readonly sendMail: SendEmailService,


  ) { }
  async create(createUserDto: CreateUserDto) {
    try {

      const { password, ...userData } = createUserDto;

      const user = await this.UserModel.create({
        ...userData,
        password: await hashPassword(password)
      })

      if (!user)
        return new NotFoundException('No se pudo crear el usuario').getResponse();

      user.token = this.getJwtToken({ id: user.id, email: user.email })

      const token = await this.TokenModel.create({
        token: generateToken(),
        user: user.id
      })

      this.sendMail.SendConfirmationEmail({
        email: user.email,
        name: user.firtsName + ' ' + user.lastName,
        token: token.token
      })
      await Promise.allSettled([user.save(), token.save()])
      return user

    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }



  async updateCurrentUserPassword(UpdatePassword: UserUpdatePasswordDto, user: User) {
    const { current_password, password } = UpdatePassword

    const userExist = await this.UserModel.findById(user.id)

    const isPasswordCorrect = await checkPassword(current_password, userExist.password)
    if (!isPasswordCorrect) {
      throw new BadRequestException('El Password actual es incorrecto').getResponse()

    }

    try {
      userExist.password = await hashPassword(password)
      await userExist.save()
      return {ok:true, msg:'El Password se modificó correctamente'}
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }


  private handleDBExceptions(error: any) {

    if (error.code === 400)
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);

    return token;

  }
}
