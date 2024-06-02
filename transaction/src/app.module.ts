import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { KafkaModule } from './kafka/kafka.module';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    PrismaModule,
    TransactionModule,
    KafkaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
