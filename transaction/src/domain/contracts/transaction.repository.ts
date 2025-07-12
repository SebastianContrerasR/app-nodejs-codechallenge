import { TransactionStatus } from '../enums/transaction-status.enum';
import { Transaction } from '../entities/transaction.entity';

export interface TransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  findAll(page: number, limit: number): Promise<{ data: Transaction[]; total: number; page: number; limit: number }>;
  updateStatus(id: string, status: TransactionStatus): Promise<void>;
}
