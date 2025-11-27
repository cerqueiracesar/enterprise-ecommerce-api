import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove campos que não estão no DTO (Segurança!)
      forbidNonWhitelisted: true, // Dá erro se mandar campo extra
      transform: true,
    }),
  );

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Enterprise E-commerce API')
    .setDescription('The best API documentation you will see today')
    .setVersion('1.0')
    .addBearerAuth() // Adiciona botão de login com Token JWT na interface
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // A rota será /api/docs

  await app.listen(3000);
}
bootstrap();
