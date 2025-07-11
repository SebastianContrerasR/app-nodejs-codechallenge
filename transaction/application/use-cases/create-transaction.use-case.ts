import { TransactionRepository } from '../../domain/contracts/transaction.repository';
import { MessagingPort } from '../../domain/contracts/messaging.port';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { Transaction } from '../../domain/entities/transaction.entity';

export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepo: TransactionRepository,
    private readonly messaging: MessagingPort
  ) {}

  async execute(dto: CreateTransactionDto): Promise<Transaction> {
    const transaction = new Transaction(
      dto.accountExternalIdDebit,
      dto.accountExternalIdCredit,
      dto.transferTypeId,
      dto.value
    );
    const result = await this.transactionRepo.create(transaction);
    await this.messaging.emit('transaction.created', result);
    return result;
  }
}
