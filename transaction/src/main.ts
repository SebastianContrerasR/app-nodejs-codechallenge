import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { KafkaOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Partitioners } from 'kafkajs';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = app.get(ConfigService)
  const port = config.get('app.port')

  const kafkaOptions: KafkaOptions = {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: config.get('kafka.clientId'),
        brokers: [config.get('kafka.broker')],
      },
      consumer: {
        groupId: config.get('kafka.consumerGroupId')
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner
      }
    }
  }

  app.connectMicroservice(kafkaOptions)
  await app.startAllMicroservices()

  await app.listen(port);
  console.log('App runnig on:', port)
}
bootstrap();
