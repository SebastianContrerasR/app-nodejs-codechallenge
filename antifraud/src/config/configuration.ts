export default () => ({
    kafka: {
        broker: process.env.KAFKA_BROKER,
        clientId: process.env.KAFKA_CLIENT_ID,
        consumerGroupId: process.env.KAFKA_CONSUMER_GROUP_ID,
    },
    app: {
        port: parseInt(process.env.APP_PORT, 10) || 3000,
    },
});
