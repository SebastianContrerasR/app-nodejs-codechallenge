Feature: Obtener todas las transacciones
  Como usuario
  Quiero poder ver todas las transacciones
  Para poder revisar el historial

  Scenario: El usuario solicita todas las transacciones
    Given existen transacciones en el sistema
    When solicito todas las transacciones
    Then recibo una lista con todas las transacciones
