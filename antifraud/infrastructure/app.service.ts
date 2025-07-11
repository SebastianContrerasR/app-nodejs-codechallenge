import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionDto } from '../application/dto/transaction.dto';
import { UpdateTransactionStatusDto } from '../application/dto/update-transaction-status.dto';
import { TransactionStatus } from '../domain/enum/transaction-status.enum';
import { Transaction } from '../domain/transaction.entity';
import { SimpleValidatorRepository } from './repositories/simple-validator.repository';
import { ValidateTransactionUseCase } from '../application/use-cases/validate-transaction.use-case';

@Injectable()
export class AppService {
  private readonly validatorRepo: SimpleValidatorRepository;
  private readonly validateTransactionUseCase: ValidateTransactionUseCase;

  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {
    this.validatorRepo = new SimpleValidatorRepository();
    this.validateTransactionUseCase = new ValidateTransactionUseCase(this.validatorRepo);
  }

  handleValidateTransaction(transactionDto: TransactionDto) {
    // Usar entidad de dominio y caso de uso
    const transactionEntity = new Transaction(
      transactionDto.transactionExternalId,
      transactionDto.transferTypeId,
      transactionDto.value
    );
    const status = this.validateTransactionUseCase.execute(transactionEntity);
    const updateTransactionStatus = new UpdateTransactionStatusDto();
    updateTransactionStatus.transactionExternalId = transactionDto.transactionExternalId;
    updateTransactionStatus.transferTypeId = transactionDto.transferTypeId;
    updateTransactionStatus.status = status;
    this.kafkaClient.emit('transaction.updated', JSON.stringify(updateTransactionStatus));
  }
}
