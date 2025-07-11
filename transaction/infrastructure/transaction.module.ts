import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { KafkaModule } from './messaging/kafka.module';
import { PrismaModule } from './persistence/prisma.module';
import { TransactionApiController } from './controllers/transaction.api.controller';
import { TransactionEventController } from './controllers/transaction.event.controller';
import { CreateTransactionUseCase } from '../application/use-cases/create-transaction.use-case';
import { GetAllTransactionsUseCase } from '../application/use-cases/get-all-transactions.use-case';
import { UpdateTransactionStatusUseCase } from '../application/use-cases/update-transaction-status.use-case';
import { FindTransactionUseCase } from '../application/use-cases/find-transaction.use-case';
import { PrismaTransactionRepository } from './persistence/prisma-transaction.repository';
import { KafkaMessagingAdapter } from './messaging/kafka-messaging.adapter';
import { PrismaService } from './persistence/prisma.service';
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
  providers: [
    {
      provide: 'TransactionRepository',
      useClass: PrismaTransactionRepository,
    },
    {
      provide: 'MessagingPort',
      useClass: KafkaMessagingAdapter,
    },
    {
      provide: CreateTransactionUseCase,
      useFactory: (repo, messaging) => new CreateTransactionUseCase(repo, messaging),
      inject: ['TransactionRepository', 'MessagingPort'],
    },
    {
      provide: GetAllTransactionsUseCase,
      useFactory: (repo) => new GetAllTransactionsUseCase(repo),
      inject: ['TransactionRepository'],
    },
    {
      provide: UpdateTransactionStatusUseCase,
      useFactory: (repo) => new UpdateTransactionStatusUseCase(repo),
      inject: ['TransactionRepository'],
    },
    {
      provide: FindTransactionUseCase,
      useFactory: (repo) => new FindTransactionUseCase(repo),
      inject: ['TransactionRepository'],
    },
    PrismaTransactionRepository,
    KafkaMessagingAdapter,
    PrismaService,
  ],
  controllers: [TransactionApiController, TransactionEventController]

})
export class TransactionModule { }
