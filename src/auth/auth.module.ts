import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { SendEmailModule } from 'src/send-email/send-email.module';



@Module({
  imports: [
    UserModule,
    ConfigModule,
    SendEmailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  exports:[ PassportModule,JwtStrategy]
})
export class AuthModule { }
