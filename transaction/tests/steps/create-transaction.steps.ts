import { CreateTransactionUseCase } from '../../src/application/use-cases/create-transaction.use-case';
import { TransactionRepository } from '../../src/domain/contracts/transaction.repository';
import { MessagingPort } from '../../src/domain/contracts/messaging.port';
import { CreateTransactionDto } from '../../src/application/dto/create-transaction.dto';
import { Transaction } from '../../src/domain/entities/transaction.entity';

describe('Feature: Crear transacción', () => {
  let useCase: CreateTransactionUseCase;
  let repoMock: jest.Mocked<TransactionRepository>;
  let messagingMock: jest.Mocked<MessagingPort>;

  beforeEach(() => {
    repoMock = {
      create: jest.fn(),
    } as any;
    messagingMock = {
      emit: jest.fn(),
    } as any;
    useCase = new CreateTransactionUseCase(repoMock, messagingMock);
  });

  describe('Scenario: Crear una transacción exitosa', () => {
    it('debe crear y emitir el evento', async () => {
      // Given
      const dto: CreateTransactionDto = {
        accountExternalIdDebit: 'debit-id',
        accountExternalIdCredit: 'credit-id',
        transferTypeId: 1,
        value: 100,
      };
      const transaction = new Transaction('debit-id', 'credit-id', 1, 100);
      repoMock.create.mockResolvedValue(transaction);

      // When
      const result = await useCase.execute(dto);

      // Then
      expect(result).toEqual(transaction);
      expect(repoMock.create).toHaveBeenCalledWith(expect.any(Transaction));
      expect(messagingMock.emit).toHaveBeenCalledWith('transaction.created', transaction);
    });
  });

  describe('Scenario: Crear una transacción con datos inválidos', () => {
    it('debe lanzar error y no emitir evento', async () => {
      // Given
      const dto: any = { accountExternalIdDebit: '', accountExternalIdCredit: '', transferTypeId: null, value: null };
      repoMock.create.mockImplementation(() => { throw new Error('Datos inválidos'); });

      // When / Then
      await expect(useCase.execute(dto)).rejects.toThrow('Datos inválidos');
      expect(messagingMock.emit).not.toHaveBeenCalled();
    });
  });
});
