// src/transaction/transaction.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Transaction, TransactionStatus } from '@prisma/client';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from './dto/update-transaction-status.dto';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {

    constructor(
        private readonly prisma: PrismaService,
        @Inject('KAFKA_SERVICE')
        private readonly kafkaClient: ClientKafka
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
        return this.prisma.transaction.findUniqueOrThrow({
            where: {
                transactionExternalId: id
            }
        })
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
    }
}
