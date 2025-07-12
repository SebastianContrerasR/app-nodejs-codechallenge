export class Transaction {
  constructor(
    public readonly transactionExternalId: string,
    public readonly transferTypeId: number,
    public readonly value: number,
  ) {}
}
