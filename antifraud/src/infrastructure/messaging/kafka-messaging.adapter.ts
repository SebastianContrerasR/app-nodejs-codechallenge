import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MessagingPort } from '../../domain/contracts/messaging.port';

@Injectable()
export class KafkaMessagingAdapter implements MessagingPort {
  private readonly logger = new Logger(KafkaMessagingAdapter.name);

  constructor(@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka) {}

  async emit(topic: string, message: any): Promise<void> {
    this.logger.log(`Emitiendo evento Kafka: topic=${topic}, message=${JSON.stringify(message)}`);
    this.kafkaClient.emit(topic, JSON.stringify(message));
  }
}
