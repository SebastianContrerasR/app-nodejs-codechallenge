// src/transaction/transaction.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Transaction } from '@prisma/client';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }

    @Post()
    async createTransaction(@Body() createTransactionDto: CreateTransactionDto): Promise<Transaction> {
        return this.transactionService.createTransaction(createTransactionDto);
    }

    @Get()
    async getAllTransactions() {
        return this.transactionService.getAllTransactions();
    }

    @MessagePattern('transaction.updated')
    async handleTransactionUpdated(@Payload() message: any) {

        console.log('Received transaction.updated', message);

        await this.transactionService.updateTransactionStatus(message)
    }
}
