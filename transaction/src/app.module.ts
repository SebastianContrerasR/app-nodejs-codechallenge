import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { KafkaModule } from './kafka/kafka.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    PrismaModule,
    KafkaModule,
    CacheModule.register({ isGlobal: true }),
  ],
  providers: [AppService],
  controllers: [AppController]

})
export class AppModule { }
