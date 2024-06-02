import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService)
  const port = config.get('app.port')

  const kafkaMicroService = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: config.get('kafka.clientId'),
        brokers: [config.get('kafka.broker')],
      },
      consumer: {
        groupId: config.get('kafka.consumerGroupId')
      }
    }
  })

  app.connectMicroservice(kafkaMicroService)
  await app.startAllMicroservices()

  await app.listen(port);
}
bootstrap();
