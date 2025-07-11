import { Injectable } from '@nestjs/common';
import { TransactionValidatorRepository } from '../../domain/contracts/transaction-validator.repository';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionStatus } from '../../domain/enums/transaction-status.enum';

@Injectable()
export class SimpleValidatorRepository implements TransactionValidatorRepository {
  validate(transaction: Transaction): TransactionStatus {
    return (transaction.value < 0 || transaction.value > 1000)
      ? TransactionStatus.REJECTED
      : TransactionStatus.APPROVED;
  }
}
