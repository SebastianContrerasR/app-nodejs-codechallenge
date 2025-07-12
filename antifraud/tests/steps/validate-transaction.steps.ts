import { defineFeature, loadFeature } from 'jest-cucumber';
import { ValidateTransactionUseCase } from '../../src/application/use-cases/validate-transaction.use-case';
import { TransactionStatus } from '../../src/domain/enums/transaction-status.enum';

const feature = loadFeature('./tests/validate-transaction.feature');

defineFeature(feature, test => {
  let useCase: ValidateTransactionUseCase;
  let mockMessaging: any;
  let transaction: any;
  let result: any;

  test('Transacción aprobada', ({ given, when, then, and }) => {
    given('una transacción con valor 500', () => {
      transaction = {
        transactionExternalId: '1',
        transferTypeId: 1,
        value: 500
      };
      mockMessaging = { emit: jest.fn() };
      useCase = new ValidateTransactionUseCase(mockMessaging);
    });

    when('valido la transacción', async () => {
      result = await useCase.execute(transaction);
    });

    then('el estado es "APPROVED"', () => {
      expect(result).toBe(TransactionStatus.APPROVED);
    });

    and('se emite el evento "transaction.updated" con estado "APPROVED"', () => {
      expect(mockMessaging.emit).toHaveBeenCalledWith('transaction.updated', expect.objectContaining({ status: TransactionStatus.APPROVED }));
    });
  });

  test('Transacción rechazada por monto negativo', ({ given, when, then, and }) => {
    given('una transacción con valor -10', () => {
      transaction = {
        transactionExternalId: '2',
        transferTypeId: 1,
        value: -10
      };
      mockMessaging = { emit: jest.fn() };
      useCase = new ValidateTransactionUseCase(mockMessaging);
    });

    when('valido la transacción', async () => {
      result = await useCase.execute(transaction);
    });

    then('el estado es "REJECTED"', () => {
      expect(result).toBe(TransactionStatus.REJECTED);
    });

    and('se emite el evento "transaction.updated" con estado "REJECTED"', () => {
      expect(mockMessaging.emit).toHaveBeenCalledWith('transaction.updated', expect.objectContaining({ status: TransactionStatus.REJECTED }));
    });
  });

  test('Transacción rechazada por monto mayor a 1000', ({ given, when, then, and }) => {
    given('una transacción con valor 1500', () => {
      transaction = {
        transactionExternalId: '3',
        transferTypeId: 1,
        value: 1500
      };
      mockMessaging = { emit: jest.fn() };
      useCase = new ValidateTransactionUseCase(mockMessaging);
    });

    when('valido la transacción', async () => {
      result = await useCase.execute(transaction);
    });

    then('el estado es "REJECTED"', () => {
      expect(result).toBe(TransactionStatus.REJECTED);
    });

    and('se emite el evento "transaction.updated" con estado "REJECTED"', () => {
      expect(mockMessaging.emit).toHaveBeenCalledWith('transaction.updated', expect.objectContaining({ status: TransactionStatus.REJECTED }));
    });
  });
});
