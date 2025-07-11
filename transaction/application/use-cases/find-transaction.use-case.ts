import { TransactionRepository } from '../../domain/contracts/transaction.repository';
import { Transaction } from '../../domain/transaction.entity';

export class FindTransactionUseCase {
  constructor(private readonly transactionRepo: TransactionRepository) {}

  async execute(id: string): Promise<Transaction | null> {
    return this.transactionRepo.findById(id);
  }
}
