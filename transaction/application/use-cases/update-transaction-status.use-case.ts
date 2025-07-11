import { TransactionStatus } from '../../domain/enum/transaction-status.enum';
import { TransactionRepository } from '../../domain/contracts/transaction.repository';
import { UpdateTransactionStatusDto } from '../dto/update-transaction-status.dto';

export class UpdateTransactionStatusUseCase {
  constructor(private readonly transactionRepo: TransactionRepository) {}

  async execute(dto: UpdateTransactionStatusDto): Promise<void> {
    await this.transactionRepo.updateStatus(dto.transactionExternalId, dto.status as TransactionStatus);
  }
}
