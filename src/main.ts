import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // cors: true
  });
  const configService = app.get(ConfigService)
  const env = configService.get('ENV')

  console.log(`Environment is ${env}`)

  const port = configService.get('PORT')

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
  console.log(`🚀  Server is running on: ${await app.getUrl()}`);
}
bootstrap();
