export default () => ({
    database: {
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        name: process.env.POSTGRES_DB,
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
