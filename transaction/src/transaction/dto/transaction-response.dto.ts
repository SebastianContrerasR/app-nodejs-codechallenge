export class TransactionResponseDto {
    transactionExternalId: string;
    transactionTypeId: number;
    transactionStatus: string;
    value: number;
    createdAt: Date;
}