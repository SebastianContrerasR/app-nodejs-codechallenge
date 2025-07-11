import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateTransactionStatusDto } from '../../application/dto/update-transaction-status.dto';
import { UpdateTransactionStatusUseCase } from '../../application/use-cases/update-transaction-status.use-case';

@Controller()
export class TransactionEventController {
    constructor(private readonly updateTransactionStatusUseCase: UpdateTransactionStatusUseCase) {}

    @MessagePattern('transaction.updated')
    async handleTransactionUpdated(@Payload() message: UpdateTransactionStatusDto) {
        await this.updateTransactionStatusUseCase.execute(message);
    }
}
