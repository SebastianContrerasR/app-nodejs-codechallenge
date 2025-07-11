import { Transaction } from '../entities/transaction.entity';
import { TransactionStatus } from '../enums/transaction-status.enum';

export interface TransactionValidatorRepository {
  validate(transaction: Transaction): TransactionStatus;
}
