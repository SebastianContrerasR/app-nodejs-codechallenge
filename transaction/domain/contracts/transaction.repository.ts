import { TransactionStatus } from '../enum/transaction-status.enum';
import { Transaction } from '../transaction.entity';

export interface TransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  findAll(page: number, limit: number): Promise<{ data: Transaction[]; total: number; page: number; limit: number }>;
  updateStatus(id: string, status: TransactionStatus): Promise<void>;
}
