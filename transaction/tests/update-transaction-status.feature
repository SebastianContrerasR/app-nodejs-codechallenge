Feature: Actualizar el estado de una transacción
  Como evento de antifraud
  Quiero poder actualizar el estado de una transacción
  Para reflejar cambios en el proceso

  Scenario: El evento actualiza el estado de una transacción existente
    Given existe una transacción con ID "1" y estado "PENDING"
    When actualizo el estado a "REJECTED"
    Then la transacción tiene estado "REJECTED"

  Scenario: El evento intenta actualizar una transacción inexistente
    Given no existe una transacción con ID "99"
    When intento actualizar el estado a "REJECTED"
    Then recibo un error de transacción no encontrada
