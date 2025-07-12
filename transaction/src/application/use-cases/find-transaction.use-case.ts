import { Logger } from '@nestjs/common';
import { TransactionRepository } from '../../domain/contracts/transaction.repository';
import { Transaction } from '../../domain/entities/transaction.entity';

export class FindTransactionUseCase {
  private readonly logger = new Logger(FindTransactionUseCase.name);

  constructor(private readonly transactionRepo: TransactionRepository) {}

  async execute(id: string): Promise<Transaction | null> {
    this.logger.log(`Buscando transacción por id: ${id}`);
    const result = await this.transactionRepo.findById(id);
    this.logger.log(`Resultado de búsqueda: ${JSON.stringify(result)}`);
    return result;
  }
}
