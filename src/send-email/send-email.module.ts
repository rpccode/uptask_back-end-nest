import { Module } from '@nestjs/common';
import { SendEmailService } from './send-email.service';
import { SendEmailController } from './send-email.controller';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports:[
    ConfigModule,
    MailerModule
  ],
  controllers: [SendEmailController],
  providers: [SendEmailService],
  exports:[SendEmailService]
})
export class SendEmailModule {}
