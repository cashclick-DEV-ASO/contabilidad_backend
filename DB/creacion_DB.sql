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
    `id` INT NOT NULL AUTO_INCREMENT,
    `id_banco` INT NOT NULL,
    `layout` JSON NOT NULL,
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
    `nombre` VARCHAR(45) NOT NULL,
    `banco` TINYINT(1) NOT NULL DEFAULT 0,
    `cuenta` TINYINT(1) NOT NULL DEFAULT 0,
    `transaccion` TINYINT(1) NOT NULL DEFAULT 0,
    `cuenta_contable` TINYINT(1) NOT NULL DEFAULT 0,
    `usuario` TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad`.`usuario` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `id_perfil` INT NOT NULL,
    `usuario` VARCHAR(50) NOT NULL,
    `credenciales` BLOB NOT NULL,
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
    `valor_antes` JSON NOT NULL,
    `valor_despues` JSON NOT NULL,
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
    `token` VARCHAR(45) NOT NULL,
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

INSERT INTO
    `contabilidad`.`layout` (id_banco, layout)
VALUES
    (
        1,
        JSON_OBJECT(
            "tipo",
            "ancho_fijo",
            "campos",
            JSON_OBJECT(
                "idMov",
                JSON_OBJECT("inicio", 0, "espacios", 3),
                "fecha",
                JSON_OBJECT("inicio", 3, "espacios", 8),
                "concepto",
                JSON_OBJECT("inicio", 11, "espacios", 20),
                "monto",
                JSON_OBJECT("inicio", 31, "espacios", 10)
            )
        )
    ),
    (
        2,
        JSON_OBJECT(
            "tipo",
            "delimitado",
            "separador",
            "|",
            "campos",
            JSON_OBJECT(
                "idMov",
                0,
                "fecha",
                1,
                "concepto",
                2,
                "monto",
                3
            )
        )
    ),
    (
        3,
        JSON_OBJECT(
            "tipo",
            "delimitado",
            "separador",
            "|",
            "campos",
            JSON_OBJECT(
                "idMov",
                0,
                "fecha",
                1,
                "concepto",
                2,
                "monto",
                3
            )
        )
    );

INSERT INTO
    `contabilidad`.`cuenta_bancaria` (cta, id_banco, comentarios)
VALUES
    ("0123456789", 1, "Cuenta de prueba"),
    ("0123456789", 2, "Cuenta de prueba"),
    ("0123456789", 3, "Cuenta de prueba");

INSERT INTO
    `contabilidad`.`perfil` (nombre, banco, cuenta, transaccion, cuenta_contable, usuario)
VALUES
    ("dios", 1, 1, 1, 1, 1),
    ("director", 1, 1, 1, 1, 1),
    ("gerente", 0, 0, 0, 0, 0),
    ("analista", 0, 0, 0, 0, 0),
    ("ejecutivo", 0, 0, 0, 0, 0);

INSERT INTO
    `contabilidad`.`usuario` (id_perfil, usuario, credenciales)
VALUES
    (
        1,
        "alberto.so@cashclick.com",
        AES_ENCRYPT("aqui yo soy dios", "PASS_KNT")
    ),
    (
        2,
        "usuario1@temporal.com",
        AES_ENCRYPT("pass temp", "PASS_KNT")
    );

