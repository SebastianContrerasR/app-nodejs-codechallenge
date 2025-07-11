// src/transaction/transaction.controller.ts
import { Body, Controller, Get, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Transaction } from '@prisma/client';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from './dto/update-transaction-status.dto';
import { AppService } from './app.service';
import { PaginationDto } from './dto/pagination.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Post()
    async createTransaction(@Body() createTransactionDto: CreateTransactionDto): Promise<Transaction> {
        return this.appService.createTransaction(createTransactionDto);
    }

    @Get(':id')
    @UseInterceptors(CacheInterceptor)
    async getTransactionById(@Param('id') id: string) {
        return this.appService.findTransactionById(id);
    }

    @Get()
    async getAllTransactions(@Query() paginationDto: PaginationDto) {
        const page = paginationDto.page || 1;
        const limit = paginationDto.limit || 10;
        return this.appService.getAllTransactions(page, limit);
    }

    @MessagePattern('transaction.updated')
    async handleTransactionUpdated(@Payload() message: UpdateTransactionStatusDto) {

        await this.appService.updateTransactionStatus(message)
    }
}
