export class Transaction {
  constructor(
    public readonly accountExternalIdDebit: string,
    public readonly accountExternalIdCredit: string,
    public readonly transferTypeId: number,
    public readonly value: number,
    public readonly transactionExternalId?: string,
    public readonly transactionType?: { name: string },
    public readonly transactionStatus?: { name: string },
    public readonly createdAt?: Date
  ) {}
}
