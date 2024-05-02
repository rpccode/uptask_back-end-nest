import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as colors from 'colors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  app.setGlobalPrefix('api')

  // Configurar títulos de documentación
  const options = new DocumentBuilder()
    .setTitle('MongoDB Uptask Nest REST API')
    .setDescription('API REST para Tareas con MongoDB')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  // La ruta en que se sirve la documentación
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(process.env.NEST_PORT);
  //  console.log(process.env.MONGO_URI)
  logger.log(colors.white.bold(`Api Corriendo en el puerto: ${process.env.NEST_PORT} :: http://localhost:${process.env.NEST_PORT}/api`))
}
bootstrap();
