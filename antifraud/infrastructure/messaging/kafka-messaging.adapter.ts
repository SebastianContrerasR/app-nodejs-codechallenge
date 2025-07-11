import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MessagingPort } from '../../domain/contracts/messaging.port';

@Injectable()
export class KafkaMessagingAdapter implements MessagingPort {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka
  ) {}

  async emit(topic: string, message: any): Promise<void> {
    await this.kafkaClient.emit(topic, JSON.stringify(message));
  }
}
