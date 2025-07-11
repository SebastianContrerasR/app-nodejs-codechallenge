// src/transaction/transaction.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { Transaction } from '@prisma/client';

@Controller('transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }

    @Post()
    async createTransaction(@Body() createTransactionDto: CreateTransactionDto): Promise<Transaction> {
        return this.transactionService.createTransaction(createTransactionDto);
    }

    @Get()
    async getAllTransactions(): Promise<TransactionResponseDto[]> {
        return this.transactionService.getAllTransactions();
    }
}
