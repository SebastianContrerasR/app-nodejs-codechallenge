// src/transaction/transaction.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class TransactionService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject('KAFKA_SERVICE')
        private readonly kafkaClient: ClientKafka
    ) { }

    async createTransaction(data: CreateTransactionDto): Promise<Transaction> {
        const transaction = this.prisma.transaction.create({
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

    async getAllTransactions(): Promise<TransactionResponseDto[]> {
        const transactions = await this.prisma.transaction.findMany();
        return transactions.map(transaction => ({
            transactionExternalId: transaction.transactionExternalId,
            transactionTypeId: transaction.transferTypeId,
            transactionStatus: transaction.status,
            value: transaction.value,
            createdAt: transaction.createdAt,
        }));
    }
}
