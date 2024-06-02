import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [PrismaModule, KafkaModule],
  providers: [TransactionService],
  controllers: [TransactionController]
})
export class TransactionModule { }
