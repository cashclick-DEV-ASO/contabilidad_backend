DROP SCHEMA IF EXISTS `contabilidad`;

-- -----------------------------------------------------
-- Schema contabilidad
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `contabilidad` DEFAULT CHARACTER SET utf8;

USE `contabilidad`;

-- -----------------------------------------------------
-- Table `contabilidad`.`banco`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad`.`banco` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    `nombre_legal` VARCHAR(100) NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad`.`layout`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad`.`layout` (
    `id` int NOT NULL AUTO_INCREMENT,
    `id_banco` int NOT NULL,
    `alias` varchar(45) DEFAULT NULL,
    `extensiones` varchar(50) DEFAULT NULL,
    `tipo` varchar(45) DEFAULT NULL,
    `layout` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `bnk_l_idx` (`id_banco` ASC) VISIBLE,
    FOREIGN KEY (`id_banco`) REFERENCES `contabilidad`.`banco` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad`.`cuenta_bancaria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad`.`cuenta_bancaria` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `cta` VARCHAR(45) NOT NULL,
    `id_banco` INT NOT NULL,
    `comentarios` VARCHAR(100) NULL,
    PRIMARY KEY (`id`),
    INDEX `bnk_idx` (`id_banco` ASC) VISIBLE,
    FOREIGN KEY (`id_banco`) REFERENCES `contabilidad`.`banco` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad`.`edo_cta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad`.`edo_cta` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `periodo` INT NOT NULL,
    `archivo` VARCHAR(45) NOT NULL,
    `fecha_captura` TIMESTAMP NOT NULL DEFAULT NOW(),
    `id_cuenta` INT NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `cta_bnk_idx` (`id_cuenta` ASC) VISIBLE,
    FOREIGN KEY (`id_cuenta`) REFERENCES `contabilidad`.`cuenta_bancaria` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad`.`transaccion_banco`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad`.`transaccion_banco` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `id_edo_cta` INT NOT NULL,
    `linea` INT NOT NULL,
    `informacion` VARCHAR(500) NOT NULL,
    `fecha_creacion` TIMESTAMP NOT NULL DEFAULT NOW(),
    `fecha_valor` TIMESTAMP NOT NULL DEFAULT NOW(),
    `concepto` VARCHAR(45) NOT NULL,
    `tipo` VARCHAR(1) NOT NULL,
    `monto` DECIMAL NOT NULL DEFAULT 0,
    `id_layout` INT NOT NULL,
    `visible` TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`id`),
    INDEX `lyt_idx` (`id_layout` ASC) VISIBLE,
    INDEX `arch_idx` (`id_edo_cta` ASC) VISIBLE,
    FOREIGN KEY (`id_layout`) REFERENCES `contabilidad`.`layout` (`id`),
    FOREIGN KEY (`id_edo_cta`) REFERENCES `contabilidad`.`edo_cta` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad`.`transaccion_mambu`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad`.`transaccion_mambu` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `periodo` VARCHAR(45) NOT NULL,
    `fecha_creacion` TIMESTAMP NOT NULL DEFAULT NOW(),
    `fecha_valor` TIMESTAMP NOT NULL DEFAULT NOW(),
    `cliente` BIGINT(15) NOT NULL,
    `credito` BIGINT(15) NOT NULL,
    `identificador_bancario` VARCHAR(50) NOT NULL,
    `concepto` VARCHAR(50) NOT NULL,
    `tipo` VARCHAR(1) NOT NULL,
    `monto` DECIMAL NOT NULL DEFAULT 0,
    `informacion` VARCHAR(500) NOT NULL,
    `visible` TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad`.`transaccion_dwh`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad`.`transaccion_dwh` (
    `id` INT NOT NULL,
    `fecha_creacion` TIMESTAMP NOT NULL DEFAULT NOW(),
    `fecha_valor` TIMESTAMP NOT NULL DEFAULT NOW(),
    `cliente` BIGINT(15) NOT NULL,
    `credito` BIGINT(15) NOT NULL,
    `concepto` VARCHAR(50) NOT NULL,
    `tipo` VARCHAR(1) NOT NULL,
    `monto` DECIMAL NOT NULL DEFAULT 0,
    `capital` DECIMAL NOT NULL DEFAULT 0,
    `interes` DECIMAL NOT NULL DEFAULT 0,
    `iva_interes` DECIMAL NOT NULL DEFAULT 0,
    `penalizacion` DECIMAL NOT NULL DEFAULT 0,
    `iva_penalizacion` DECIMAL NOT NULL DEFAULT 0,
    `visible` TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad`.`dwh_mambu`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad`.`dwh_mambu` (
    `id_dwh` INT NOT NULL,
    `id_mambu` INT NOT NULL,
    INDEX `rel_dwh_idx` (`id_dwh` ASC) VISIBLE,
    INDEX `rel_mambu_idx` (`id_mambu` ASC) VISIBLE,
    FOREIGN KEY (`id_dwh`) REFERENCES `contabilidad`.`transaccion_dwh` (`id`),
    FOREIGN KEY (`id_mambu`) REFERENCES `contabilidad`.`transaccion_mambu` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad`.`transaccion_virtual`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad`.`transaccion_virtual` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `id_transaccion` INT NOT NULL,
    `monto` DOUBLE NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
    INDEX `trn_b_idx` (`id_transaccion` ASC) VISIBLE,
    FOREIGN KEY (`id_transaccion`) REFERENCES `contabilidad`.`transaccion_banco` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad`.`cuenta_contable`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad`.`cuenta_contable` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `cta` VARCHAR(45) NOT NULL,
    `concepto` VARCHAR(45) NOT NULL,
    `jerarquia` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad`.`contable_bancaria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad`.`contable_bancaria` (
    `id_bancaria` INT NOT NULL AUTO_INCREMENT,
    `id_contable` INT NOT NULL,
    INDEX `cta_bnkria_idx` (`id_bancaria` ASC) VISIBLE,
    INDEX `cta_cnt_idx` (`id_contable` ASC) VISIBLE,
    FOREIGN KEY (`id_bancaria`) REFERENCES `contabilidad`.`cuenta_bancaria` (`id`),
    FOREIGN KEY (`id_contable`) REFERENCES `contabilidad`.`cuenta_contable` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad`.`banco_dwh`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad`.`banco_dwh` (
    `id_banco` INT NOT NULL,
    `id_dwh` INT NOT NULL,
    INDEX `id_trn_bnk_idx` (`id_banco` ASC) VISIBLE,
    INDEX `id_trn_dwh_idx` (`id_dwh` ASC) VISIBLE,
    PRIMARY KEY (`id_banco`, `id_dwh`),
    FOREIGN KEY (`id_banco`) REFERENCES `contabilidad`.`transaccion_banco` (`id`),
    FOREIGN KEY (`id_dwh`) REFERENCES `contabilidad`.`transaccion_dwh` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad`.`perfil`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad`.`perfil` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad`.`mapa_navegacion_frontend`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad`.`mapa_navegacion_frontend` (
    `id` int NOT NULL AUTO_INCREMENT,
    `grupo` varchar(100) NOT NULL,
    `titulo` varchar(100) NOT NULL,
    `vista` varchar(100) DEFAULT NULL,
    `padre` varchar(100) DEFAULT NULL,
    `orden` int NOT NULL,
    `permanente` tinyint(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad`.`permiso_frontend`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad`.`permiso_frontend` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `id_perfil` INT NOT NULL,
    `id_mapa` INT NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `id_prf_idx` (`id_perfil` ASC) VISIBLE,
    INDEX `id_mapa_idx` (`id_mapa` ASC) VISIBLE,
    FOREIGN KEY (`id_perfil`) REFERENCES `contabilidad`.`perfil` (`id`),
    FOREIGN KEY (`id_mapa`) REFERENCES `contabilidad`.`mapa_navegacion_frontend` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad`.`usuario` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `id_perfil` INT NOT NULL,
    `usuario` VARCHAR(100) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `password` BLOB NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `id_prf_idx` (`id_perfil` ASC) VISIBLE,
    FOREIGN KEY (`id_perfil`) REFERENCES `contabilidad`.`perfil` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad`.`bitacora_cambios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad`.`bitacora_cambios` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `id_transaccion` INT NOT NULL,
    `id_usuario` INT NOT NULL,
    `valor_antes` VARCHAR(1000) NOT NULL,
    `valor_despues` VARCHAR(1000) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `id_trb_idx` (`id_transaccion` ASC) VISIBLE,
    INDEX `id_usr_idx` (`id_usuario` ASC) VISIBLE,
    FOREIGN KEY (`id_transaccion`) REFERENCES `contabilidad`.`transaccion_banco` (`id`),
    FOREIGN KEY (`id_transaccion`) REFERENCES `contabilidad`.`transaccion_dwh` (`id`),
    FOREIGN KEY (`id_transaccion`) REFERENCES `contabilidad`.`transaccion_mambu` (`id`),
    FOREIGN KEY (`id_usuario`) REFERENCES `contabilidad`.`usuario` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad`.`sesion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad`.`sesion` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(255) NOT NULL,
    `id_usuario` INT NOT NULL,
    `creacion` TIMESTAMP NOT NULL DEFAULT NOW(),
    `vencimiento` TIMESTAMP NOT NULL DEFAULT (DATE_ADD(NOW(), INTERVAL 30 MINUTE)),
    PRIMARY KEY (`id`),
    INDEX `id_usrs_idx` (`id_usuario` ASC) VISIBLE,
    UNIQUE INDEX `token_UNIQUE` (`token` ASC) VISIBLE,
    FOREIGN KEY (`id_usuario`) REFERENCES `contabilidad`.`usuario` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad`.`intento_acceso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad`.`intento_acceso` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `fecha` TIMESTAMP NOT NULL DEFAULT NOW(),
    `usuario` VARCHAR(45) NULL,
    `pass` VARCHAR(45) NOT NULL,
    `ip` VARCHAR(45),
    `host` VARCHAR(45),
    PRIMARY KEY (`id`),
    INDEX `id_idx` (`id` ASC) VISIBLE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Registros para la tabla `contabilidad`.`banco`
-- -----------------------------------------------------
INSERT INTO
    `contabilidad`.`banco` (Nombre, Nombre_Legal)
VALUES
    (
        "BBVA",
        "BBVA México, S.A., Institución de Banca Múltiple"
    ),
    ("Conekta", "GRUPO CONEKTAME SA DE CV"),
    (
        "STP",
        "SISTEMA DE TRANSFERENCIAS Y PAGOS STP, S.A. DE C.V. INSTITUCIÓN DE FONDOS DE PAGO ELECTRÓNICO"
    );

-- -----------------------------------------------------
-- Registros para la tabla `contabilidad`.`layout`
-- -----------------------------------------------------
INSERT INTO
    `contabilidad`.`layout` (id_banco, alias, tipo, extensiones, layout)
VALUES
    (
        1,
        "Cobranza BBVA",
        "fijo",
        "txt,exp",
        '{"apertura":{"idRegistro":1,"campos":{"No_Cta":{"inicio":3,"espacios":16,"tipo":"number"},"Titular":{"inicio":51,"espacios":23,"tipo":"string"},"Fecha_Operación":{"inicio":20,"espacios":6,"tipo":"date"},"Fecha_Emisión":{"inicio":26,"espacios":6,"tipo":"date"},"Saldo_Inicial":{"inicio":33,"espacios":14,"tipo":"decimal"}}},"registros":{"idRegistro":2,"tandem":{"movimiento":2,"detalle":3,"inicio":1,"espacios":1},"campos":{"Fecha_Operación":{"inicio":10,"espacios":6,"tipo":"date"},"Fecha_Valor":{"inicio":16,"espacios":6,"tipo":"date"},"Id_Operación":{"inicio":24,"espacios":3,"tipo":"string"},"Tipo_Movimiento":{"inicio":27,"espacios":1,"tipo":"number"},"Monto":{"inicio":28,"espacios":14,"tipo":"decimal"},"Descripción_1":{"inicio":52,"espacios":28,"tipo":"string"},"Descripción_2":{"inicio":85,"espacios":30,"tipo":"string"},"Descripción_3":{"inicio":122,"espacios":38,"tipo":"string"}}},"cierre":{"idRegistro":3,"tandem":{"idMovimiento":2,"detalle":3,"inicio":1,"espacios":1},"campos":{"Saldo_Final":{"inicio":137,"espacios":14,"tipo":"decimal"},"Total_Cargos":{"inicio":103,"espacios":14,"tipo":"decimal"},"Total_Abonos":{"inicio":122,"espacios":14,"tipo":"decimal"},"No_Cargos":{"inicio":98,"espacios":5,"tipo":"number"},"No_Abonos":{"inicio":117,"espacios":5,"tipo":"number"}}}}'
    ),
    (
        1,
        "Dispersion BBVA",
        "delimitado",
        "csv,exp",
        '{"apertura":{"idRegistro":1,"campos":{"No_Cta":{"inicio":3,"espacios":16,"tipo":"number"},"Titular":{"inicio":51,"espacios":23,"tipo":"string"},"Fecha_Operación":{"inicio":20,"espacios":6,"tipo":"date"},"Fecha_Emisión":{"inicio":26,"espacios":6,"tipo":"date"},"Saldo_Inicial":{"inicio":33,"espacios":14,"tipo":"decimal"}}},"registros":{"idRegistro":2,"tandem":{"movimiento":2,"detalle":3,"inicio":1,"espacios":1},"campos":{"Fecha_Operación":{"inicio":10,"espacios":6,"tipo":"date"},"Fecha_Valor":{"inicio":16,"espacios":6,"tipo":"date"},"Id_Operación":{"inicio":24,"espacios":3,"tipo":"string"},"Tipo_Movimiento":{"inicio":27,"espacios":1,"tipo":"number"},"Monto":{"inicio":28,"espacios":14,"tipo":"decimal"},"Descripción_1":{"inicio":52,"espacios":28,"tipo":"string"},"Descripción_2":{"inicio":85,"espacios":30,"tipo":"string"},"Descripción_3":{"inicio":122,"espacios":38,"tipo":"string"}}},"cierre":{"idRegistro":3,"tandem":{"idMovimiento":2,"detalle":3,"inicio":1,"espacios":1},"campos":{"Saldo_Final":{"inicio":137,"espacios":14,"tipo":"decimal"},"Total_Cargos":{"inicio":103,"espacios":14,"tipo":"decimal"},"Total_Abonos":{"inicio":122,"espacios":14,"tipo":"decimal"},"No_Cargos":{"inicio":98,"espacios":5,"tipo":"number"},"No_Abonos":{"inicio":117,"espacios":5,"tipo":"number"}}}}'
    ),
    (
        3,
        "Cobranza STP",
        "excel",
        "csv,xslx",
        '{"encabezados":5, "columnas": [{"nombre":"Fecha_Operación","tipo":"date"},{"nombre":"Fecha_Valor","tipo":"date"},{"nombre":"Id_Operación","tipo":"string"},{"nombre":"Tipo_Movimiento","tipo":"number"},{"nombre":"Monto","tipo":"decimal"},{"nombre":"Descripción_1","tipo":"string"},{"nombre":"Descripción_2","tipo":"string"},{"nombre":"Descripción_3","tipo":"string"}]}'
    );

-- -----------------------------------------------------
-- Registros para la tabla `contabilidad`.`cuenta_bancaria`
-- -----------------------------------------------------
INSERT INTO
    `contabilidad`.`cuenta_bancaria` (cta, id_banco, comentarios)
VALUES
    ("0123456789", 1, "Cuenta de prueba"),
    ("0123456789", 2, "Cuenta de prueba"),
    ("0123456789", 3, "Cuenta de prueba");

-- -----------------------------------------------------
-- Registros para la tabla `contabilidad`.`mapa_navegacion_frontend`
-- -----------------------------------------------------
INSERT INTO
    `contabilidad`.`mapa_navegacion_frontend` (grupo, titulo, vista, padre, orden, permanente)
VALUES
    ('inicio', 'Inicio', 'Inicio', NULL, 0, 1),
    (
        'transacciones',
        'Transacciones',
        NULL,
        NULL,
        1,
        0
    ),
    (
        'saldos',
        'Saldos Contables',
        NULL,
        'Transacciones',
        0,
        0
    ),
    (
        'registro',
        'Registro',
        'RegSaldos',
        'Saldos Contables',
        0,
        0
    ),
    (
        'consulta',
        'Consulta',
        'ConSaldos',
        'Saldos Contables',
        1,
        0
    ),
    ('bancos', 'Bancos', NULL, 'Transacciones', 1, 0),
    (
        'registro',
        'Registro',
        'RegTrnBancos',
        'Bancos',
        0,
        0
    ),
    (
        'consulta',
        'Consulta',
        'ConTrnBancos',
        'Bancos',
        1,
        0
    ),
    ('dwh', 'DWH', 'TrnDWH', 'Transacciones', 2, 0),
    ('mambu', 'Mambu', NULL, 'Transacciones', 3, 0),
    (
        'registro',
        'Registro',
        'RegTrnMambu',
        'Mambu',
        0,
        0
    ),
    (
        'consulta',
        'Consulta',
        'ConTrnMambu',
        'Mambu',
        1,
        0
    ),
    ('conciliacion', 'Conciliación', NULL, NULL, 2, 0),
    (
        'conciliar',
        'Conciliar',
        'Conciliar',
        'Conciliación',
        0,
        0
    ),
    (
        'consulta',
        'Consulta',
        'Conciliación',
        'Conciliación',
        1,
        0
    ),
    (
        'noConciliado',
        'No Conciliado',
        'NoConciliado',
        'Conciliación',
        2,
        0
    ),
    ('reportes', 'Reportes', NULL, NULL, 3, 0),
    (
        'resConciliacion',
        'Resumen Conciliación',
        'ResConciliacion',
        'Reportes',
        0,
        0
    ),
    (
        'saf',
        'Saldo a Favor',
        'SaldoFavor',
        'Reportes',
        1,
        0
    ),
    (
        'recalculoInteres',
        'Recalculo de Interés',
        'RecalculoInteres',
        'Reportes',
        2,
        0
    ),
    (
        'recalculoCapital',
        'Recalculo de Capital',
        'RecalculoCapital',
        'Reportes',
        3,
        0
    ),
    (
        'cartera',
        'Cartera',
        'Cartera',
        'Reportes',
        4,
        0
    ),
    (
        'aclaraciones',
        'Aclaraciones',
        'Aclaraciones',
        'Reportes',
        5,
        0
    ),
    (
        'ajustes',
        'Ajustes',
        'Ajustes',
        'Reportes',
        6,
        0
    ),
    (
        'edoCta',
        'Estado de Cuenta',
        'EdoCta',
        'Reportes',
        7,
        0
    ),
    (
        'administracion',
        'Administración',
        NULL,
        NULL,
        4,
        0
    ),
    (
        'cuentasBancarias',
        'Cuentas Bancarias',
        NULL,
        'Administración',
        0,
        0
    ),
    (
        'registro',
        'Registro',
        'RegCtasBancarias',
        'Cuentas Bancarias',
        0,
        0
    ),
    (
        'consulta',
        'Consulta',
        'ConCtasBancarias',
        'Cuentas Bancarias',
        1,
        0
    ),
    (
        'cuentasContables',
        'Cuentas Contables',
        NULL,
        'Administración',
        1,
        0
    ),
    (
        'registro',
        'Registro',
        'RegCtasContables',
        'Cuentas Contables',
        0,
        0
    ),
    (
        'consulta',
        'Consulta',
        'ConCtasContables',
        'Cuentas Contables',
        1,
        0
    ),
    (
        'plantillas',
        'Plantillas',
        NULL,
        'Administración',
        2,
        0
    ),
    ('layout', 'Layout', 'Layout', 'Plantillas', 0, 0),
    (
        'Etiquetas',
        'Etiquetas',
        'Etiquetas',
        'Plantillas',
        1,
        0
    ),
    (
        'variables',
        'Variables',
        'Variables',
        'Administración',
        3,
        0
    ),
    ('logout', 'Salir', 'Logout', NULL, 5, 1);

-- -----------------------------------------------------
-- Registros para la tabla `contabilidad`.`perfil`
-- -----------------------------------------------------
INSERT INTO
    `contabilidad`.`perfil` (nombre)
VALUES
    ('Administrador'),
    ('Director'),
    ('Gerente'),
    ('Analista');

-- -----------------------------------------------------
-- Registros para la tabla `contabilidad`.`permiso_frontend`
-- -----------------------------------------------------
INSERT INTO
    `contabilidad`.`permiso_frontend` (id_perfil, id_mapa)
VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4),
    (1, 5),
    (1, 6),
    (1, 7),
    (1, 8),
    (1, 9),
    (1, 10),
    (1, 11),
    (1, 12),
    (1, 13),
    (1, 14),
    (1, 15),
    (1, 16),
    (1, 17),
    (1, 18),
    (1, 19),
    (1, 20),
    (1, 21),
    (1, 22),
    (1, 23),
    (1, 24),
    (1, 25),
    (1, 26),
    (1, 27),
    (1, 28),
    (1, 29),
    (1, 30),
    (1, 31),
    (1, 32),
    (1, 33),
    (1, 34),
    (1, 35),
    (1, 36),
    (1, 37),
    (2, 1),
    (2, 2),
    (2, 3),
    (2, 4),
    (2, 5),
    (2, 6),
    (2, 7),
    (2, 8),
    (2, 9),
    (2, 10),
    (2, 11),
    (2, 12),
    (2, 13),
    (2, 14),
    (2, 15),
    (2, 16),
    (2, 17),
    (2, 18),
    (2, 19),
    (2, 20),
    (2, 21),
    (2, 22),
    (2, 23),
    (2, 24),
    (2, 25),
    (2, 26),
    (2, 27),
    (2, 28),
    (2, 29),
    (2, 30),
    (2, 31),
    (2, 32),
    (2, 33),
    (2, 35),
    (2, 36),
    (2, 37),
    (3, 1),
    (3, 2),
    (3, 3),
    (3, 4),
    (3, 5),
    (3, 6),
    (3, 7),
    (3, 8),
    (3, 9),
    (3, 10),
    (3, 11),
    (3, 12),
    (3, 13),
    (3, 14),
    (3, 15),
    (3, 16),
    (3, 17),
    (3, 18),
    (3, 19),
    (3, 20),
    (3, 21),
    (3, 22),
    (3, 23),
    (3, 24),
    (3, 25),
    (3, 37),
    (4, 1),
    (4, 2),
    (4, 3),
    (4, 4),
    (4, 5),
    (4, 6),
    (4, 7),
    (4, 8),
    (4, 9),
    (4, 10),
    (4, 11),
    (4, 12),
    (4, 13),
    (4, 14),
    (4, 15),
    (4, 16),
    (4, 32),
    (4, 37);

-- -----------------------------------------------------
-- Registros para la tabla `contabilidad`.`usuario`
-- -----------------------------------------------------
INSERT INTO
    `contabilidad`.`usuario` (id_perfil, usuario, nombre, PASSWORD)
VALUES
    (
        1,
        "alberto.soto@cashclick.mx",
        "Alberto Soto Ortega",
        AES_ENCRYPT("main_desarrollador", "save_pa$$")
    ),
    (
        4,
        "demo@capacitacion.com",
        "Capacitación",
        AES_ENCRYPT("capacitacion_cashclick", "save_pa$$")
    ),
    (
        2,
        "director@cashclick.mx",
        "Director",
        AES_ENCRYPT("director01_inicial", "save_pa$$")
    ),
    (
        3,
        "gerente@cashclick.mx",
        "Gerente",
        AES_ENCRYPT("gerente01_inicial", "save_pa$$")
    );