import { Logger } from '@nestjs/common';
import { TransactionRepository } from '../../domain/contracts/transaction.repository';
import { MessagingPort } from '../../domain/contracts/messaging.port';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { Transaction } from '../../domain/entities/transaction.entity';

export class CreateTransactionUseCase {
  private readonly logger = new Logger(CreateTransactionUseCase.name);

  constructor(
    private readonly transactionRepo: TransactionRepository,
    private readonly messaging: MessagingPort
  ) {}

  async execute(dto: CreateTransactionDto): Promise<Transaction> {
    this.logger.log(`Creando transacción: ${JSON.stringify(dto)}`);
    const transaction = new Transaction(
      dto.accountExternalIdDebit,
      dto.accountExternalIdCredit,
      dto.transferTypeId,
      dto.value
    );
    const result = await this.transactionRepo.create(transaction);
    this.logger.log(`Transacción creada: ${JSON.stringify(result)}`);
    await this.messaging.emit('transaction.created', result);
    this.logger.log('Evento transaction.created emitido');
    return result;
  }
}
