import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ProyectModule } from './proyect/proyect.module';
import { TaskModule } from './task/task.module';
import { CommonModule } from './common/common.module';
import { ProjectExistsMiddleware } from './common/middleware/project-exists/project-exists.middleware';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SendEmailModule } from './send-email/send-email.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';


@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    ProyectModule,
    TaskModule,
    CommonModule,
    UserModule,
    AuthModule,
    SendEmailModule,
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProjectExistsMiddleware).forRoutes('project/:projectId/task'); // Adjust the route pattern as needed
  }
}
