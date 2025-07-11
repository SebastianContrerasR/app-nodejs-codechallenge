import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ValidateTransactionUseCase } from 'application/use-cases/validate-transaction.use-case';
import configuration from './config/configuration';
import { AntifraudEventController } from './controllers/antifraud.event.controller';
import { KafkaMessagingAdapter } from './messaging/kafka-messaging.adapter';
import { KafkaModule } from './messaging/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    KafkaModule
  ],
  controllers: [AntifraudEventController],
  providers: [
    {
      provide: ValidateTransactionUseCase,
      useFactory: (messaging) => new ValidateTransactionUseCase(messaging),
      inject: ['MessagingPort'],
    },
    {
      provide: 'MessagingPort',
      useClass: KafkaMessagingAdapter,
    },
    KafkaMessagingAdapter,
  ],
})
export class AppModule { }
