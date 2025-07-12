import { defineFeature, loadFeature } from 'jest-cucumber';
import { GetAllTransactionsUseCase } from '../../src/application/use-cases/get-all-transactions.use-case';

const feature = loadFeature('./tests/get-all-transactions.feature');

defineFeature(feature, test => {
  let useCase: GetAllTransactionsUseCase;
  let result: any;
  let mockRepo: any;

  test('El usuario solicita todas las transacciones', ({ given, when, then }) => {
    given('existen transacciones en el sistema', () => {
      mockRepo = { findAll: jest.fn().mockResolvedValue({
        data: [
          { transactionExternalId: '1', amount: 100 },
          { transactionExternalId: '2', amount: 200 }
        ],
        total: 2,
        page: 1,
        limit: 10
      }) };
      useCase = new GetAllTransactionsUseCase(mockRepo);
    });

    when('solicito todas las transacciones', async () => {
      const response = await useCase.execute(1, 10);
      result = response.data;
    });

    then('recibo una lista con todas las transacciones', () => {
      expect(result).toHaveLength(2);
      expect(result[0].transactionExternalId).toBe('1');
      expect(result[1].transactionExternalId).toBe('2');
    });
  });
});
