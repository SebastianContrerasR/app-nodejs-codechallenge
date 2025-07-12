Feature: Buscar una transacción por ID
  Como usuario
  Quiero poder buscar una transacción específica
  Para poder ver sus detalles

  Scenario: El usuario busca una transacción existente
    Given existe una transacción con ID "1"
    When busco la transacción con ID "1"
    Then recibo los detalles de la transacción

  Scenario: El usuario busca una transacción inexistente
    Given no existe una transacción con ID "99"
    When busco la transacción con ID "99"
    Then recibo un resultado nulo
