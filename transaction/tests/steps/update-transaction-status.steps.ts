
import { defineFeature, loadFeature } from 'jest-cucumber';
import { UpdateTransactionStatusUseCase } from '../../src/application/use-cases/update-transaction-status.use-case';
import { UpdateTransactionStatusDto } from '../../src/application/dto/update-transaction-status.dto';
import { TransactionStatus } from '../../src/domain/enums/transaction-status.enum';

const feature = loadFeature('./tests/update-transaction-status.feature');

defineFeature(feature, test => {
  let useCase: UpdateTransactionStatusUseCase;
  let error: any;
  let mockRepo: any;
  let dto: UpdateTransactionStatusDto;

  test('El evento actualiza el estado de una transacción existente', ({ given, when, then }) => {
    given('existe una transacción con ID "1" y estado "PENDING"', () => {
      mockRepo = {
        updateStatus: jest.fn().mockResolvedValue(undefined)
      };
      useCase = new UpdateTransactionStatusUseCase(mockRepo);
      dto = { transactionExternalId: '1', status: TransactionStatus.REJECTED, transferTypeId: 1 };
    });

    when('actualizo el estado a "REJECTED"', async () => {
      await useCase.execute(dto);
    });

    then('la transacción tiene estado "REJECTED"', () => {
      expect(mockRepo.updateStatus).toHaveBeenCalledWith('1', TransactionStatus.REJECTED);
    });
  });

  test('El evento intenta actualizar una transacción inexistente', ({ given, when, then }) => {
    given('no existe una transacción con ID "99"', () => {
      mockRepo = {
        updateStatus: jest.fn().mockImplementation(() => { throw new Error('Transacción no encontrada'); })
      };
      useCase = new UpdateTransactionStatusUseCase(mockRepo);
      dto = { transactionExternalId: '99', status: TransactionStatus.REJECTED, transferTypeId: 1 };
    });

    when('intento actualizar el estado a "REJECTED"', async () => {
      try {
        await useCase.execute(dto);
      } catch (e) {
        error = e;
      }
    });

    then('recibo un error de transacción no encontrada', () => {
      expect(error).toBeDefined();
      expect(error.message).toMatch(/no encontrada/i);
    });
  });
});
