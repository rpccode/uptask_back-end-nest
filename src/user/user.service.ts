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

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
    @InjectModel(Token.name) private readonly TokenModel: Model<Token>,
    private readonly jwtService: JwtService,
    private readonly sendMail : SendEmailService,


  ) { }
  async create(createUserDto: CreateUserDto) {
    try {

      const { password, ...userData } = createUserDto;

      const user = await this.UserModel.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      })

      if (!user)
        return new NotFoundException('No se pudo crear el usuario').getResponse();

      user.token = this.getJwtToken({ id: user.id, email: user.email })

      const token = await this.TokenModel.create({
        token:generateToken(),
        user:user.id
      })

      this.sendMail.SendConfirmationEmail({
        email: user.email,
        name: user.firtsName + ' '+ user.lastName,
        token:token.token
      })
      await Promise.allSettled([user.save(),token.save()])
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
  SingUp(createUserDto: CreateUserDto) {

  }
  private handleDBExceptions(error: any) {

    if (error.code === '23505')
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
