export default () => ({
    database_shard_1: {
        url: process.env.DATABASE_URL_1,
    },
    database_shard_2: {
        url: process.env.DATABASE_URL_2,
    },
    kafka: {
        broker: process.env.KAFKA_BROKER,
        clientId: process.env.KAFKA_CLIENT_ID,
        consumerGroupId: process.env.KAFKA_CONSUMER_GROUP_ID,
    },
    app: {
        port: parseInt(process.env.APP_PORT, 10) || 3000,
    }
});
