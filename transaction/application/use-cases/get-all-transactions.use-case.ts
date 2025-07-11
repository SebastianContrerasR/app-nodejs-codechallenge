import { TransactionRepository } from '../../domain/contracts/transaction.repository';

export class GetAllTransactionsUseCase {
  constructor(private readonly transactionRepo: TransactionRepository) {}

  async execute(page: number, limit: number) {
    return this.transactionRepo.findAll(page, limit);
  }
}
