import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    private PIVOT = 2;
    public prismaShard1: PrismaClient;
    public prismaShard2: PrismaClient;

    constructor(configService: ConfigService) {

        this.prismaShard1 = new PrismaClient({
            datasources: {
                db: {
                    url: configService.get('database_shard_1.url'),
                },
            },
        });

        this.prismaShard2 = new PrismaClient({
            datasources: {
                db: {
                    url: configService.get('database_shard_2.url'),
                },
            },
        });
    }

    async onModuleInit() {
        await this.prismaShard1.$connect();
        await this.prismaShard2.$connect();
    }

    async onModuleDestroy() {
        await this.prismaShard1.$disconnect();
        await this.prismaShard2.$disconnect();
    }

    getPrismaClient(transferTypeId: number): PrismaClient {
        return transferTypeId <= this.PIVOT ? this.prismaShard1 : this.prismaShard2;
    }
}
