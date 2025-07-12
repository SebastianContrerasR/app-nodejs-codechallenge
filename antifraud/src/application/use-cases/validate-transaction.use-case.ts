import { Logger } from '@nestjs/common';
import { MessagingPort } from '../../domain/contracts/messaging.port';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionStatus } from '../../domain/enums/transaction-status.enum';
import { TransactionDto } from '../dto/transaction.dto';
import { UpdateTransactionStatusDto } from '../dto/update-transaction-status.dto';

export class ValidateTransactionUseCase {
  private readonly logger = new Logger(ValidateTransactionUseCase.name);

  constructor(private readonly messaging: MessagingPort) {}

  async execute(transaction: TransactionDto): Promise<TransactionStatus> {
    const transactionEntity = new Transaction(
      transaction.transactionExternalId,
      transaction.transferTypeId,
      transaction.value
    );
    this.logger.log(`Validando transacción: ${JSON.stringify(transactionEntity)}`);
    const status =
      transactionEntity.value < 0 || transactionEntity.value > 1000
        ? TransactionStatus.REJECTED
        : TransactionStatus.APPROVED;
    this.logger.log(`Resultado de validación: ${status}`);
    const updateTransactionStatus = new UpdateTransactionStatusDto();
    updateTransactionStatus.transactionExternalId = transactionEntity.transactionExternalId;
    updateTransactionStatus.transferTypeId = transactionEntity.transferTypeId;
    updateTransactionStatus.status = status;
    await this.messaging.emit('transaction.updated', updateTransactionStatus);
    this.logger.log('Evento transaction.updated emitido');
    return status;
  }
}
