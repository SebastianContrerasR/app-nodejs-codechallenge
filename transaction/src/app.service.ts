import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Transaction, TransactionStatus } from '@prisma/client';
import { Cache } from 'cache-manager';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from './dto/update-transaction-status.dto';
import { PrismaService } from './prisma/prisma.service';
import { TransactionResponseDto } from './dto/transaction-response.dto';

@Injectable()
export class AppService {

    constructor(
        private readonly prismaService: PrismaService,
        @Inject('KAFKA_SERVICE')
        private readonly kafkaClient: ClientKafka,
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
    ) { }

    async createTransaction(data: CreateTransactionDto): Promise<Transaction> {
        const prisma = this.prismaService.getPrismaClient(data.transferTypeId)

        const transaction = await prisma.transaction.create({
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

    async findTransactionById(id: string): Promise<TransactionResponseDto> {
        const [transaction1, transaction2] = await Promise.all([
            this.prismaService.prismaShard1.transaction.findUnique({
                where: {
                    transactionExternalId: id,
                },
            }),
            this.prismaService.prismaShard2.transaction.findUnique({
                where: {
                    transactionExternalId: id,
                },
            }),
        ]);

        if (!transaction1 && !transaction2) {
            throw new NotFoundException('Transaction not found')
        }

        const transaction = transaction1 || transaction2;

        const transactionResponseDto: TransactionResponseDto = {
            transactionExternalId: transaction.transactionExternalId,
            createdAt: transaction.createdAt,
            transactionStatus: {
                name: transaction.status
            },
            transactionType: {
                name: transaction.transferTypeId.toString(),
            },
            value: transaction.value
        }

        return transactionResponseDto
    }

    async getAllTransactions(page: number, limit: number) {
        const offset = (page - 1) * limit;

        const [transactions1, transactions2] = await Promise.all([
            this.prismaService.prismaShard1.transaction.findMany({
                skip: offset,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prismaService.prismaShard2.transaction.findMany({
                skip: offset,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
        ]);

        const total1 = await this.prismaService.prismaShard1.transaction.count();
        const total2 = await this.prismaService.prismaShard2.transaction.count();
        const total = total1 + total2;

        const allTransactions = [...transactions1, ...transactions2].sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        );

        return {
            data: allTransactions.slice(offset, offset + limit).map(transaction => {
                const transactionResponseDto: TransactionResponseDto = {
                    transactionExternalId: transaction.transactionExternalId,
                    createdAt: transaction.createdAt,
                    transactionStatus: {
                        name: transaction.status
                    },
                    transactionType: {
                        name: transaction.transferTypeId.toString(),
                    },
                    value: transaction.value
                }

                return transactionResponseDto
            }),
            total,
            page,
            limit,
        };
    }
    async updateTransactionStatus(data: UpdateTransactionStatusDto) {

        const prisma = this.prismaService.getPrismaClient(data.transferTypeId)

        const status = data.status as TransactionStatus
        await prisma.transaction.update({
            where: { transactionExternalId: data.transactionExternalId },
            data: { status },
        });

        await this.cacheManager.del(`/${data.transactionExternalId}`);
    }
}
