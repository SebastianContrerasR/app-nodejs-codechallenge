// src/transaction/transaction.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Transaction } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
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

    async updateTransactionStatus(message: any) {
        await this.prisma.transaction.update({
            where: { transactionExternalId: message.transactionExternalId },
            data: { status: message.status },
        });
    }

    async getAllTransactions() {
        const transactions = await this.prisma.transaction.findMany();
        return transactions
    }
}
