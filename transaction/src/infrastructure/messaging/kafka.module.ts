import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Partitioners } from 'kafkajs';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'KAFKA_SERVICE',
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.KAFKA,
                    options: {
                        client: {
                            clientId: configService.get('kafka.clientId'),
                            brokers: [configService.get('kafka.broker')],
                        },
                        producer: {
                            createPartitioner: Partitioners.LegacyPartitioner
                        }
                    },
                })
            }
        ]),
    ],
    exports: [ClientsModule],
})
export class KafkaModule { }
