import { Logger } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionStatus } from '../../domain/enums/transaction-status.enum';
import { MessagingPort } from '../../domain/contracts/messaging.port';
import { UpdateTransactionStatusDto } from '../dto/update-transaction-status.dto';

export class ValidateTransactionUseCase {
  private readonly logger = new Logger(ValidateTransactionUseCase.name);

  constructor(private readonly messaging: MessagingPort) {}

  async execute(transaction: Transaction): Promise<TransactionStatus> {
    this.logger.log(`Validando transacción: ${JSON.stringify(transaction)}`);
    const status =
      transaction.value < 0 || transaction.value > 1000
        ? TransactionStatus.REJECTED
        : TransactionStatus.APPROVED;
    this.logger.log(`Resultado de validación: ${status}`);
    const updateTransactionStatus = new UpdateTransactionStatusDto();
    updateTransactionStatus.transactionExternalId = transaction.transactionExternalId;
    updateTransactionStatus.transferTypeId = transaction.transferTypeId;
    updateTransactionStatus.status = status;
    await this.messaging.emit('transaction.updated', updateTransactionStatus);
    this.logger.log('Evento transaction.updated emitido');
    return status;
  }
}
