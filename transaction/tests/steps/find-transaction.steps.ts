import { defineFeature, loadFeature } from 'jest-cucumber';
import { FindTransactionUseCase } from '../../src/application/use-cases/find-transaction.use-case';

const feature = loadFeature('./tests/find-transaction.feature');

defineFeature(feature, test => {
  let useCase: FindTransactionUseCase;
  let result: any;
  let mockRepo: any;

  test('El usuario busca una transacción existente', ({ given, when, then }) => {
    given('existe una transacción con ID "1"', () => {
      mockRepo = { findById: jest.fn().mockResolvedValue({ transactionExternalId: '1', amount: 100 }) };
      useCase = new FindTransactionUseCase(mockRepo);
    });

    when('busco la transacción con ID "1"', async () => {
      result = await useCase.execute('1');
    });

    then('recibo los detalles de la transacción', () => {
      expect(result).not.toBeNull();
      expect(result?.transactionExternalId).toBe('1');
    });
  });

  test('El usuario busca una transacción inexistente', ({ given, when, then }) => {
    given('no existe una transacción con ID "99"', () => {
      mockRepo = { findById: jest.fn().mockResolvedValue(null) };
      useCase = new FindTransactionUseCase(mockRepo);
    });

    when('busco la transacción con ID "99"', async () => {
      result = await useCase.execute('99');
    });

    then('recibo un resultado nulo', () => {
      expect(result).toBeNull();
    });
  });
});
