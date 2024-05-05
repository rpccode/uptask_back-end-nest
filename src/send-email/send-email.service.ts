import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateSendEmailDto } from './dto/create-send-email.dto';
import { UpdateSendEmailDto } from './dto/update-send-email.dto';
import * as pug from 'pug';
import { MailerService } from '@nestjs-modules/mailer';
import { IEmail } from './interfece/IEmail';
import * as path from 'path';


@Injectable()
export class SendEmailService {
    private readonly logger = new Logger('MailService');

    constructor(
        private readonly mailerService: MailerService
    ) { }

    async SendConfirmationEmail(user: IEmail) {
        try {
            const templatePath = path.join(__dirname, '..', '..', 'src', 'send-email', 'template', 'confirmation-email.pug');
            const html = pug.renderFile(templatePath, {
                name: user.name,
                frontendUrl: process.env.FRONTEND_URL,
                token: user.token
            });

            const info = await this.mailerService.sendMail({
                from: 'UpTask <admin@uptask.com>',
                to: user.email,
                subject: 'UpTask - Confirma tu cuenta',
                html: html
            });
            if (!info) throw new InternalServerErrorException('Error Inesperado al enviar el E-Mail');

            return { ok: true, msg: 'Mensaje enviado' };
        } catch (error) {
            this.handleDBExceptions(error)
        }
    }
    async sendPasswordResetToken(user: IEmail) {
        try {
            const templatePath = path.join(__dirname, '..', '..', 'src', 'send-email', 'template', 'password-reset-email.pug')
            const html = pug.renderFile(templatePath, {
                name: user.name,
                frontendUrl: process.env.FRONTEND_URL,
                token: user.token
            });

            const info = await this.mailerService.sendMail({
                from: 'UpTask <admin@uptask.com>',
                to: user.email,
                subject: 'UpTask - Restablece tu contraseña',
                html: html
            });

            return { ok: true, msg: 'Mensaje enviado' };
        } catch (error) {
            this.handleDBExceptions(error)
        }
    };
    private handleDBExceptions(error: any) {
        console.log(error)
        if (error.code === '23505')
            throw new BadRequestException(error.detail);

        this.logger.error(error)
        // console.log(error)
        throw new InternalServerErrorException('Unexpected error, check server logs');

    }
}
