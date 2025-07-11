import { CacheInterceptor } from '@nestjs/cache-manager';
import { Body, Controller, Get, NotFoundException, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { CreateTransactionDto } from '../../application/dto/create-transaction.dto';
import { PaginationDto } from '../../application/dto/pagination.dto';
import { TransactionResponseDto } from '../../application/dto/transaction-response.dto';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction.use-case';
import { FindTransactionUseCase } from '../../application/use-cases/find-transaction.use-case';
import { GetAllTransactionsUseCase } from '../../application/use-cases/get-all-transactions.use-case';
import { Transaction } from '../../domain/entities/transaction.entity';

@Controller()
export class TransactionApiController {
    constructor(
        private readonly createTransactionUseCase: CreateTransactionUseCase,
        private readonly getAllTransactionsUseCase: GetAllTransactionsUseCase,
        private readonly findTransactionUseCase: FindTransactionUseCase
    ) { }

    @Post()
    async createTransaction(@Body() createTransactionDto: CreateTransactionDto): Promise<Transaction> {
        return this.createTransactionUseCase.execute(createTransactionDto);
    }

    @Get(':id')
    @UseInterceptors(CacheInterceptor)
    async getTransactionById(@Param('id') id: string): Promise<TransactionResponseDto> {
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

    @Get()
    async getAllTransactions(@Query() paginationDto: PaginationDto) {
        const page = paginationDto.page || 1;
        const limit = paginationDto.limit || 10;
        return this.getAllTransactionsUseCase.execute(+page, +limit);
    }
}
