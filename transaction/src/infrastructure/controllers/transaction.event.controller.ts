import { Logger } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateTransactionStatusDto } from '../../application/dto/update-transaction-status.dto';
import { UpdateTransactionStatusUseCase } from '../../application/use-cases/update-transaction-status.use-case';

@Controller()
export class TransactionEventController {
    private readonly logger = new Logger(TransactionEventController.name);

    constructor(private readonly updateTransactionStatusUseCase: UpdateTransactionStatusUseCase) {}

    @MessagePattern('transaction.updated')
    async handleTransactionUpdated(@Payload() message: UpdateTransactionStatusDto) {
        this.logger.log(`Evento recibido: transaction.updated - ${JSON.stringify(message)}`);
        await this.updateTransactionStatusUseCase.execute(message);
        this.logger.log(`Estado de transacción actualizado: ${message.transactionExternalId}`);
    }
}
