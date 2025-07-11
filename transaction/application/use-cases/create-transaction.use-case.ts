import { TransactionRepository } from '../../domain/contracts/transaction.repository';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { Transaction } from '../../domain/transaction.entity';

export class CreateTransactionUseCase {
  constructor(private readonly transactionRepo: TransactionRepository) {}

  async execute(dto: CreateTransactionDto): Promise<Transaction> {
    const transaction = new Transaction(
      dto.accountExternalIdDebit,
      dto.accountExternalIdCredit,
      dto.transferTypeId,
      dto.value
    );
    return this.transactionRepo.create(transaction);
  }
}
