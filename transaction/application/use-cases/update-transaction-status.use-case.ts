import { Logger } from '@nestjs/common';
import { TransactionStatus } from '../../domain/enums/transaction-status.enum';
import { TransactionRepository } from '../../domain/contracts/transaction.repository';
import { UpdateTransactionStatusDto } from '../dto/update-transaction-status.dto';

export class UpdateTransactionStatusUseCase {
  private readonly logger = new Logger(UpdateTransactionStatusUseCase.name);

  constructor(private readonly transactionRepo: TransactionRepository) {}

  async execute(dto: UpdateTransactionStatusDto): Promise<void> {
    this.logger.log(`Actualizando estado de transacción: ${JSON.stringify(dto)}`);
    await this.transactionRepo.updateStatus(dto.transactionExternalId, dto.status as TransactionStatus);
    this.logger.log(`Estado actualizado para: ${dto.transactionExternalId}`);
  }
}
