import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { User } from 'src/user/Models/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectModel(User.name) private readonly UserModel: Model<User>,

        configService: ConfigService
    ) {

        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }


    async validate(payload: JwtPayload): Promise<User> {

        const { id } = payload;
        // console.log(id)
        const user = await this.UserModel.findById(id);
        // console.log(user)
        if (!user)
            throw new UnauthorizedException('Token no Valido')

        if (!user.IsActive)
            throw new UnauthorizedException('El usuario esta inactivo, Comuniquece con el administrador');

        if (!user.IsConfirmed)
            throw new UnauthorizedException('El usuario no esta confirmado, Comuniquece con el administrador');

        return user;
    }

}