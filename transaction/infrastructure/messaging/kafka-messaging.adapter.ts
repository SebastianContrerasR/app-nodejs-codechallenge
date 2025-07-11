import { Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MessagingPort } from '../../domain/contracts/messaging.port';

@Injectable()
export class KafkaMessagingAdapter implements MessagingPort {
  constructor(private readonly kafkaClient: ClientKafka) {}

  async emit(topic: string, message: any): Promise<void> {
    this.kafkaClient.emit(topic, JSON.stringify(message));
  }
}
