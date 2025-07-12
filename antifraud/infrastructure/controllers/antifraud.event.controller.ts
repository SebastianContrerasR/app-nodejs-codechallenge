import { Logger } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionDto } from '../../application/dto/transaction.dto';
import { ValidateTransactionUseCase } from '../../application/use-cases/validate-transaction.use-case';
import { Transaction } from '../../domain/entities/transaction.entity';

@Controller()
export class AntifraudEventController {
  private readonly logger = new Logger(AntifraudEventController.name);

  constructor(
    private readonly validateTransactionUseCase: ValidateTransactionUseCase
  ) {}

  @MessagePattern('transaction.created')
  async handleValidateTransaction(@Payload() message: TransactionDto) {
    this.logger.log(
      `Evento recibido: transaction.created - ${JSON.stringify(message)}`
    );
    const transactionEntity = new Transaction(
      message.transactionExternalId,
      message.transferTypeId,
      message.value
    );
    await this.validateTransactionUseCase.execute(transactionEntity);
    this.logger.log(
      `Validación procesada para: ${message.transactionExternalId}`
    );
  }
}
