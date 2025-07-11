import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../../domain/contracts/transaction.repository';
import { Transaction } from '../../domain/transaction.entity';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionStatus } from '../../domain/enum/transaction-status.enum';

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(transaction: Transaction): Promise<Transaction> {
    const prisma = this.prismaService.getPrismaClient(transaction.transferTypeId);
    const tx = await prisma.transaction.create({
      data: {
        accountExternalIdDebit: transaction.accountExternalIdDebit,
        accountExternalIdCredit: transaction.accountExternalIdCredit,
        transferTypeId: transaction.transferTypeId,
        value: transaction.value,
      },
    });
    return new Transaction(
      tx.accountExternalIdDebit,
      tx.accountExternalIdCredit,
      tx.transferTypeId,
      tx.value,
      tx.transactionExternalId,
      { name: tx.transferTypeId?.toString() },
      { name: tx.status },
      tx.createdAt
    );
  }

  async findById(id: string): Promise<Transaction | null> {
    const [tx1, tx2] = await Promise.all([
      this.prismaService.prismaShard1.transaction.findUnique({ where: { transactionExternalId: id } }),
      this.prismaService.prismaShard2.transaction.findUnique({ where: { transactionExternalId: id } }),
    ]);
    const tx = tx1 || tx2;
    if (!tx) return null;
    return new Transaction(
      tx.accountExternalIdDebit,
      tx.accountExternalIdCredit,
      tx.transferTypeId,
      tx.value,
      tx.transactionExternalId,
      { name: tx.transferTypeId?.toString() },
      { name: tx.status },
      tx.createdAt
    );
  }

  async findAll(page: number, limit: number): Promise<{ data: Transaction[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;
    const [txs1, txs2] = await Promise.all([
      this.prismaService.prismaShard1.transaction.findMany({ skip: offset, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prismaService.prismaShard2.transaction.findMany({ skip: offset, take: limit, orderBy: { createdAt: 'desc' } }),
    ]);
    const total1 = await this.prismaService.prismaShard1.transaction.count();
    const total2 = await this.prismaService.prismaShard2.transaction.count();
    const total = total1 + total2;
    const allTxs = [...txs1, ...txs2].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return {
      data: allTxs.slice(offset, offset + limit).map(tx => new Transaction(
        tx.accountExternalIdDebit,
        tx.accountExternalIdCredit,
        tx.transferTypeId,
        tx.value,
        tx.transactionExternalId,
        { name: tx.transferTypeId?.toString() },
        { name: tx.status },
        tx.createdAt
      )),
      total,
      page,
      limit,
    };
  }

  async updateStatus(id: string, status: TransactionStatus): Promise<void> {
    const [tx1, tx2] = await Promise.all([
      this.prismaService.prismaShard1.transaction.findUnique({ where: { transactionExternalId: id } }),
      this.prismaService.prismaShard2.transaction.findUnique({ where: { transactionExternalId: id } }),
    ]);
    const tx = tx1 || tx2;
    if (!tx) return;
    const prisma = this.prismaService.getPrismaClient(tx.transferTypeId);
    await prisma.transaction.update({
      where: { transactionExternalId: id },
      data: { status },
    });
  }
}
