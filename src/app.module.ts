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
import { TaskExistsMiddleware } from './common/middleware/Task-exist/task-exist.middleware';
// import { hasAuthorizationMiddleware } from './common/middleware/Task-exist/hasAuthorization.middleware';


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
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: +process.env.MAIL_PORT,
        ignoreTLS: true,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: '"Uptask" <UptaskAdmin@gmail.com>',
      },
  
      template: {
        dir: process.cwd() + '/template/',
        adapter: new PugAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProjectExistsMiddleware).forRoutes('project/:projectId/task'); 
    consumer.apply(TaskExistsMiddleware).forRoutes('project/:projectId/task/:TaskId'); 
    // consumer.apply(hasAuthorizationMiddleware).forRoutes('project/:projectId/task/:TaskId'); 


  }
}
