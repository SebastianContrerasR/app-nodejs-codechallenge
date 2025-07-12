import { Logger } from '@nestjs/common';
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
    private readonly logger = new Logger(TransactionApiController.name);

    constructor(
        private readonly createTransactionUseCase: CreateTransactionUseCase,
        private readonly getAllTransactionsUseCase: GetAllTransactionsUseCase,
        private readonly findTransactionUseCase: FindTransactionUseCase
    ) { }

    @Post()
    async createTransaction(@Body() createTransactionDto: CreateTransactionDto): Promise<Transaction> {
        this.logger.log(`POST / - Creando transacción: ${JSON.stringify(createTransactionDto)}`);
        const result = await this.createTransactionUseCase.execute(createTransactionDto);
        this.logger.log(`Transacción creada: ${JSON.stringify(result)}`);
        return result;
    }

    @Get(':id')
    @UseInterceptors(CacheInterceptor)
    async getTransactionById(@Param('id') id: string): Promise<TransactionResponseDto> {
        this.logger.log(`GET /${id} - Buscando transacción`);
        const transaction = await this.findTransactionUseCase.execute(id);
        if (!transaction) {
            this.logger.warn(`Transacción no encontrada: ${id}`);
            throw new NotFoundException('Transaction not found');
        }
        this.logger.log(`Transacción encontrada: ${JSON.stringify(transaction)}`);
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
        this.logger.log(`GET / - Listando transacciones: ${JSON.stringify(paginationDto)}`);
        const page = paginationDto.page || 1;
        const limit = paginationDto.limit || 10;
        const result = await this.getAllTransactionsUseCase.execute(+page, +limit);
        this.logger.log(`Transacciones listadas: ${JSON.stringify(result)}`);
        return result;
    }
}
