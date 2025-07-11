# Yape Code Challenge :rocket:

Our code challenge will let you marvel us with your Jedi coding skills :smile:. 

Don't forget that the proper way to submit your work is to fork the repo and create a PR :wink: ... have fun !!

- [Problem](#problem)
- [Tech Stack](#tech_stack)
- [Send us your challenge](#send_us_your_challenge)

# Problem

Every time a financial transaction is created it must be validated by our anti-fraud microservice and then the same service sends a message back to update the transaction status.
For now, we have only three transaction statuses:

<ol>
  <li>pending</li>
  <li>approved</li>
  <li>rejected</li>  
</ol>

Every transaction with a value greater than 1000 should be rejected.

```mermaid
  flowchart LR
    Transaction -- Save Transaction with pending Status --> transactionDatabase[(Database)]
    Transaction --Send transaction Created event--> Anti-Fraud
    Anti-Fraud -- Send transaction Status Approved event--> Transaction
    Anti-Fraud -- Send transaction Status Rejected event--> Transaction
    Transaction -- Update transaction Status event--> transactionDatabase[(Database)]
```

# Tech Stack

<ol>
  <li>Node (Nestjs and Prisma) </li>
  <li>Postgres</li>
  <li>Kafka</li>    
</ol>

We do provide a `Dockerfile` to help you get started with a dev environment.

You must have two resources:

1. Resource to create a transaction that must containt:

```json
{
  "accountExternalIdDebit": "Guid",
  "accountExternalIdCredit": "Guid",
  "tranferTypeId": 1,
  "value": 120
}
```

2. Resource to retrieve a transaction

```json
{
  "transactionExternalId": "Guid",
  "transactionType": {
    "name": ""
  },
  "transactionStatus": {
    "name": ""
  },
  "value": 120,
  "createdAt": "Date"
}
```
## Setup
### In the `root` folder

1. Run docker compose
```sh
docker compose up
```

### In the `transaction` folder

1. Install packages
```sh
npm i
```

2. Copy the `.env.example` file to `.env` in the same folder
```sh
cp .env.example .env
```

3. Execute the creation of the Prisma schema with
```sh
npm run db:sync
```
This will create the schema in both shards.

4. Build the application
```sh
npm run build
```

5. Run the application
```sh
npm run start
```

### In the `antifraud` folder

1. Install packages
```sh
npm i
```

2. Copy the `.env.example` file to `.env` in the same folder
```sh
cp .env.example .env
```

3. Build the application
```sh
npm run build
```

4. Run the application
```sh
npm run start
```

## Endpoints and Postman Collection

I provide the file `Reto YAPE.postman_collection.json`, which includes example endpoints. You can easily import it into Postman.

I've developed three endpoints:
- POST Create Transaction
  
- GET Get Transaction by ID
  
- GET Get Transactions (pagination)

## Optional

You can use any approach to store transaction data but you should consider that we may deal with high volume scenarios where we have a huge amount of writes and reads for the same data at the same time. How would you tackle this requirement?

To address this scenario, two proposals were made:

1. **Caching for the endpoint fetching transactions by ID**: By implementing caching, we aim to improve the performance of the endpoint responsible for retrieving transactions based on their ID. This approach involves storing previously fetched data in a cache, reducing the need for repeated database queries and thereby enhancing response times.

2. **Sharding based on the 'TransferTypeId' attribute**: Sharding is proposed as a method to distribute the load across multiple database shards. In this context, a pivot value of 2 is defined, determining which shard to utilize based on the value of the 'TransferTypeId' attribute. Specifically, values ranging from 1 to 2 will be directed to Shard 1, while values from 3 to 5 will be directed to Shard 2. This distribution strategy helps balance the workload and optimize resource utilization, ensuring efficient handling of transaction requests.
