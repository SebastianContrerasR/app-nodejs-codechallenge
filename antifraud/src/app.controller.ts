import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionDto } from './dto/transaction.dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) { }

  @MessagePattern('transaction.created')
  async handleTransactionUpdated(@Payload() message: TransactionDto) {

    console.log('Received transaction.created', message);

    await this.appService.handleTransactionEvent(message)
  }
}
