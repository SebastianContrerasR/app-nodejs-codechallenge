Feature: Validar transacción
  Como sistema antifraude
  Quiero validar el monto de la transacción
  Para aprobar o rechazar la transacción

  Scenario: Transacción aprobada
    Given una transacción con valor 500
    When valido la transacción
    Then el estado es "APPROVED"
    And se emite el evento "transaction.updated" con estado "APPROVED"

  Scenario: Transacción rechazada por monto negativo
    Given una transacción con valor -10
    When valido la transacción
    Then el estado es "REJECTED"
    And se emite el evento "transaction.updated" con estado "REJECTED"

  Scenario: Transacción rechazada por monto mayor a 1000
    Given una transacción con valor 1500
    When valido la transacción
    Then el estado es "REJECTED"
    And se emite el evento "transaction.updated" con estado "REJECTED"
