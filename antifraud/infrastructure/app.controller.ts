import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionDto } from '../application/dto/transaction.dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) { }

  @MessagePattern('transaction.created')
  async handleValidateTransaction(@Payload() message: TransactionDto) {

    await this.appService.handleValidateTransaction(message)
  }
}
