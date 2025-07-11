import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionDto } from '../application/dto/transaction.dto';
import { UpdateTransactionStatusDto } from '../application/dto/update-transaction-status.dto';
import { TransactionStatus } from '../domain/enums/transaction-status.enum';
import { Transaction } from '../domain/entities/transaction.entity';
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

  // Este servicio solo debe orquestar dependencias, la lógica se movió al controlador de eventos.
}
