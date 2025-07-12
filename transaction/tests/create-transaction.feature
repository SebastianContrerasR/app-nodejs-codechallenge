Feature: Crear transacción

  Scenario: Crear una transacción exitosa
    Given una solicitud de transacción válida
    When se ejecuta el caso de uso de creación de transacción
    Then la transacción debe ser creada y emitido el evento correspondiente

  Scenario: Crear una transacción con datos inválidos
    Given una solicitud de transacción con datos faltantes o incorrectos
    When se ejecuta el caso de uso de creación de transacción
    Then debe lanzarse un error y no debe emitirse ningún evento
