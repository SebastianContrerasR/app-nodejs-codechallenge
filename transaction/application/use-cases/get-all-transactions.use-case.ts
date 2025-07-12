import { Logger } from '@nestjs/common';
import { TransactionRepository } from '../../domain/contracts/transaction.repository';

export class GetAllTransactionsUseCase {
  private readonly logger = new Logger(GetAllTransactionsUseCase.name);

  constructor(private readonly transactionRepo: TransactionRepository) {}

  async execute(page: number, limit: number) {
    this.logger.log(`Obteniendo transacciones: page=${page}, limit=${limit}`);
    const result = await this.transactionRepo.findAll(page, limit);
    this.logger.log(`Transacciones obtenidas: ${JSON.stringify(result)}`);
    return result;
  }
}
