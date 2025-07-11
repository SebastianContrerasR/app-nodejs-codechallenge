import { Transaction } from '../transaction.entity';
import { TransactionStatus } from '../enum/transaction-status.enum';

export interface TransactionValidatorRepository {
  validate(transaction: Transaction): TransactionStatus;
}
