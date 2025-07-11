import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionStatus } from '@prisma/client';
import { Transaction } from '../domain/transaction.entity';
import { PrismaTransactionRepository } from './repositories/prisma-transaction.repository';
import { CreateTransactionUseCase } from '../application/use-cases/create-transaction.use-case';
import { FindTransactionUseCase } from '../application/use-cases/find-transaction.use-case';
import { GetAllTransactionsUseCase } from '../application/use-cases/get-all-transactions.use-case';
import { UpdateTransactionStatusUseCase } from '../application/use-cases/update-transaction-status.use-case';
import { Cache } from 'cache-manager';
import { CreateTransactionDto } from '../application/dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from '../application/dto/update-transaction-status.dto';
import { PrismaService } from './prisma/prisma.service';
import { TransactionResponseDto } from '../application/dto/transaction-response.dto';

@Injectable()
export class AppService {

    private readonly transactionRepo: PrismaTransactionRepository;
    private readonly createTransactionUseCase: CreateTransactionUseCase;
    private readonly findTransactionUseCase: FindTransactionUseCase;
    private readonly getAllTransactionsUseCase: GetAllTransactionsUseCase;
    private readonly updateTransactionStatusUseCase: UpdateTransactionStatusUseCase;

    constructor(
        private readonly prismaService: PrismaService,
        @Inject('KAFKA_SERVICE')
        private readonly kafkaClient: ClientKafka,
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
    ) {
        this.transactionRepo = new PrismaTransactionRepository(this.prismaService);
        this.createTransactionUseCase = new CreateTransactionUseCase(this.transactionRepo);
        this.findTransactionUseCase = new FindTransactionUseCase(this.transactionRepo);
        this.getAllTransactionsUseCase = new GetAllTransactionsUseCase(this.transactionRepo);
        this.updateTransactionStatusUseCase = new UpdateTransactionStatusUseCase(this.transactionRepo);
    }

    async createTransaction(data: CreateTransactionDto): Promise<Transaction> {
        const transaction = await this.createTransactionUseCase.execute(data);
        this.kafkaClient.emit('transaction.created', JSON.stringify(transaction));
        return transaction;
    }

    async findTransactionById(id: string): Promise<TransactionResponseDto> {
        const transaction = await this.findTransactionUseCase.execute(id);
        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }
        return {
            transactionExternalId: transaction.transactionExternalId,
            createdAt: transaction.createdAt,
            transactionStatus: transaction.transactionStatus,
            transactionType: transaction.transactionType,
            value: transaction.value
        };
    }

    async getAllTransactions(page: number, limit: number) {
        return this.getAllTransactionsUseCase.execute(page, limit);
    }
    async updateTransactionStatus(data: UpdateTransactionStatusDto) {
        await this.updateTransactionStatusUseCase.execute(data);
        await this.cacheManager.del(`/${data.transactionExternalId}`);
    }
}
