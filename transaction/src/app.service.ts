// src/transaction/transaction.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Transaction, TransactionStatus } from '@prisma/client';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from './dto/update-transaction-status.dto';
import { PrismaService } from './prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {

    constructor(
        private readonly prisma: PrismaService,
        @Inject('KAFKA_SERVICE')
        private readonly kafkaClient: ClientKafka,
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
    ) { }

    async createTransaction(data: CreateTransactionDto): Promise<Transaction> {
        const transaction = await this.prisma.transaction.create({
            data: {
                ...data,
            },
        });

        this.kafkaClient.emit(
            'transaction.created',
            JSON.stringify(transaction)
        );
        return transaction
    }

    async findTransactionById(id: string) {
        const transaction = await this.prisma.transaction.findUnique({
            where: {
                transactionExternalId: id
            }
        })

        if (!transaction) {
            throw new NotFoundException('Transaction not found')
        }

        return transaction
    }

    async getAllTransactions(page: number, limit: number) {
        const offset = (page - 1) * limit;

        const transactions = await this.prisma.transaction.findMany({
            skip: offset,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
        });

        const total = await this.prisma.transaction.count();

        return {
            data: transactions,
            total,
            page,
            limit,
        };
    }
    async updateTransactionStatus(message: UpdateTransactionStatusDto) {
        const status = message.status as TransactionStatus
        await this.prisma.transaction.update({
            where: { transactionExternalId: message.transactionExternalId },
            data: { status },
        });

        await this.cacheManager.del(`/${message.transactionExternalId}`);
    }
}
