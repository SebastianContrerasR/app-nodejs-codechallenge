// src/transaction/transaction.service.ts
import { Injectable } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';

@Injectable()
export class TransactionService {
    constructor(private readonly prisma: PrismaService) { }

    async createTransaction(data: CreateTransactionDto): Promise<Transaction> {
        return this.prisma.transaction.create({
            data: {
                ...data,
            },
        });
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
