import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionDto } from './dto/transaction.dto';
import { UpdateTransactionStatusDto } from './dto/update-transaction-status.dto';
import { TransactionStatus } from './enum/transaction-status.enum';

@Injectable()
export class AppService {
  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) { }

  validateTransaction(transaction: TransactionDto) {
    return transaction.value > 1000 ? TransactionStatus.REJECTED : TransactionStatus.APPROVED;
  }

  handleValidateTransaction(transaction: TransactionDto) {
    const status = this.validateTransaction(transaction)
    const updateTransactionStatus = new UpdateTransactionStatusDto()
    updateTransactionStatus.transactionExternalId = transaction.transactionExternalId;
    updateTransactionStatus.status = status

    this.kafkaClient.emit('transaction.updated', JSON.stringify(updateTransactionStatus));
  }
}
