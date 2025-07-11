import { TransactionValidatorRepository } from '../../domain/contracts/transaction-validator.repository';
import { Transaction } from '../../domain/transaction.entity';
import { TransactionStatus } from '../../domain/enum/transaction-status.enum';

export class ValidateTransactionUseCase {
  constructor(private readonly validatorRepo: TransactionValidatorRepository) {}

  execute(transaction: Transaction): TransactionStatus {
    return this.validatorRepo.validate(transaction);
  }
}
