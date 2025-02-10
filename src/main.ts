import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  ConsoleLogger,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger('verbose', {
      logLevels: ['verbose', 'debug', 'error', 'fatal', 'log', 'warn'],
    }),
  });
  app.use(cookieParser());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Blog API')
    .setVersion('1.0')
    .addCookieAuth('Authentication', {
      type: 'http',
      in: 'Header',
      scheme: 'Bearer',
    })
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const theme = new SwaggerTheme();
  const options = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.ONE_DARK),
    customJs: '/swagger-custom.js',
    swaggerOptions: { persistAuthorization: true },
  };

  SwaggerModule.setup('api', app, document, options);

  app.enableCors({
    origin: process.env['FRONTEND_URL'] ?? 'http://localhost:5173',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(process.env['PORT'] ?? 3000);

  Logger.log(`Server running on port ${process.env['PORT'] ?? 3000}`);
}
bootstrap();
