import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionStatus } from '../../domain/enums/transaction-status.enum';
import { MessagingPort } from '../../domain/contracts/messaging.port';
import { UpdateTransactionStatusDto } from '../dto/update-transaction-status.dto';

export class ValidateTransactionUseCase {
  constructor(private readonly messaging: MessagingPort) {}

  async execute(transaction: Transaction): Promise<TransactionStatus> {
    const status =
      transaction.value < 0 || transaction.value > 1000
        ? TransactionStatus.REJECTED
        : TransactionStatus.APPROVED;
    const updateTransactionStatus = new UpdateTransactionStatusDto();
    updateTransactionStatus.transactionExternalId = transaction.transactionExternalId;
    updateTransactionStatus.transferTypeId = transaction.transferTypeId;
    updateTransactionStatus.status = status;
    await this.messaging.emit('transaction.updated', updateTransactionStatus);
    return status;
  }
}
