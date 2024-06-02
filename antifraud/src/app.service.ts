import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionDto } from './dto/transaction.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) { }

  validateTransaction(transaction: TransactionDto) {
    return transaction.value > 1000 ? 'REJECTED' : 'APPROVED';
  }

  handleTransactionEvent(transaction: TransactionDto) {
    const status = this.validateTransaction(transaction)

    this.kafkaClient.emit('transaction.updated', JSON.stringify({
      transactionExternalId: transaction.transactionExternalId,
      status,
    }));
  }
}
