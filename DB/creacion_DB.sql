-- -----------------------------------------------------
-- Schema contabilidad_cashclick
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `contabilidad_cashclick` DEFAULT CHARACTER SET utf8;

USE `contabilidad_cashclick`;

-- -----------------------------------------------------
-- Table `contabilidad_cashclick`.`banco`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad_cashclick`.`banco` (
    `id` INT NOT NULL,
    `nombre` VARCHAR(45) NOT NULL,
    `nombre_legal` VARCHAR(45) NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad_cashclick`.`cuenta_bancaria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad_cashclick`.`cuenta_bancaria` (
    `id` INT NOT NULL,
    `cta` VARCHAR(45) NOT NULL,
    `id_banco` INT NOT NULL,
    `comentarios` VARCHAR(100) NULL,
    PRIMARY KEY (`id`),
    INDEX `bnk_idx` (`id_banco` ASC) VISIBLE,
    CONSTRAINT `bnk` FOREIGN KEY (`id_banco`) REFERENCES `contabilidad_cashclick`.`banco` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad_cashclick`.`layout`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad_cashclick`.`layout` (
    `id` INT NOT NULL,
    `id_banco` INT NOT NULL,
    `layout` JSON NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `bnk_l_idx` (`id_banco` ASC) VISIBLE,
    CONSTRAINT `bnk_l` FOREIGN KEY (`id_banco`) REFERENCES `contabilidad_cashclick`.`banco` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad_cashclick`.`transaccion_banco`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad_cashclick`.`transaccion_banco` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `id_cta` INT NOT NULL,
    `periodo` INT NOT NULL,
    `id_archivo` INT NOT NULL,
    `linea` INT NOT NULL,
    `informacion` VARCHAR(500) NOT NULL,
    `fecha_creacion` TIMESTAMP NOT NULL,
    `fecha_valor` TIMESTAMP NOT NULL,
    `concepto` VARCHAR(45) NOT NULL,
    `tipo` VARCHAR(1) NOT NULL,
    `monto` DECIMAL NOT NULL DEFAULT 0,
    `id_layout` INT NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `cta_b_idx` (`id_cta` ASC) VISIBLE,
    INDEX `lyt_idx` (`id_layout` ASC) VISIBLE,
    CONSTRAINT `cta_b` FOREIGN KEY (`id_cta`) REFERENCES `contabilidad_cashclick`.`cuenta_bancaria` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `lyt` FOREIGN KEY (`id_layout`) REFERENCES `contabilidad_cashclick`.`layout` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad_cashclick`.`transaccion_mambu`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad_cashclick`.`transaccion_mambu` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `periodo` VARCHAR(45) NOT NULL,
    `fecha_creacion` TIMESTAMP NOT NULL,
    `fecha_valor` TIMESTAMP NOT NULL,
    `cliente` BIGINT(15) NOT NULL,
    `credito` BIGINT(15) NOT NULL,
    `identificador_bancario` VARCHAR(50) NOT NULL,
    `concepto` VARCHAR(50) NOT NULL,
    `tipo` VARCHAR(1) NOT NULL,
    `monto` DECIMAL NOT NULL DEFAULT 0,
    `informacion` VARCHAR(500) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad_cashclick`.`transaccion_dwh`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad_cashclick`.`transaccion_dwh` (
    `id` INT NOT NULL,
    `fecha_creacion` TIMESTAMP NOT NULL,
    `fecha_valor` TIMESTAMP NOT NULL,
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
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad_cashclick`.`dwh_mambu`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad_cashclick`.`dwh_mambu` (
    `id_dwh` INT NOT NULL,
    `id_mambu` INT NOT NULL,
    INDEX `rel_dwh_idx` (`id_dwh` ASC) VISIBLE,
    INDEX `rel_mambu_idx` (`id_mambu` ASC) VISIBLE,
    CONSTRAINT `rel_dwh` FOREIGN KEY (`id_dwh`) REFERENCES `contabilidad_cashclick`.`transaccion_dwh` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `rel_mambu` FOREIGN KEY (`id_mambu`) REFERENCES `contabilidad_cashclick`.`transaccion_mambu` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad_cashclick`.`transaccion_virtual`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad_cashclick`.`transaccion_virtual` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `id_transaccion` INT NOT NULL,
    `monto` DOUBLE NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
    INDEX `trn_b_idx` (`id_transaccion` ASC) VISIBLE,
    CONSTRAINT `trn_b` FOREIGN KEY (`id_transaccion`) REFERENCES `contabilidad_cashclick`.`transaccion_banco` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad_cashclick`.`cuenta_contable`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad_cashclick`.`cuenta_contable` (
    `id` INT NOT NULL,
    `cta` VARCHAR(45) NOT NULL,
    `concepto` VARCHAR(45) NOT NULL,
    `jerarquia` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad_cashclick`.`contable_bancaria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad_cashclick`.`contable_bancaria` (
    `id_bancaria` INT NOT NULL,
    `id_contable` INT NOT NULL,
    INDEX `cta_bnk_idx` (`id_bancaria` ASC) VISIBLE,
    INDEX `cta_cnt_idx` (`id_contable` ASC) VISIBLE,
    CONSTRAINT `cta_bnk` FOREIGN KEY (`id_bancaria`) REFERENCES `contabilidad_cashclick`.`cuenta_bancaria` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `cta_cnt` FOREIGN KEY (`id_contable`) REFERENCES `contabilidad_cashclick`.`cuenta_contable` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad_cashclick`.`banco_dwh`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad_cashclick`.`banco_dwh` (
    `trn_banco` INT NOT NULL,
    `trn_dwh` INT NOT NULL,
    INDEX `id_trn_bnk_idx` (`trn_banco` ASC) VISIBLE,
    INDEX `id_trn_dwh_idx` (`trn_dwh` ASC) VISIBLE,
    CONSTRAINT `id_trn_bnk` FOREIGN KEY (`trn_banco`) REFERENCES `contabilidad_cashclick`.`transaccion_banco` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `id_trn_dwh` FOREIGN KEY (`trn_dwh`) REFERENCES `contabilidad_cashclick`.`transaccion_dwh` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad_cashclick`.`perfil`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad_cashclick`.`perfil` (
    `id` INT NOT NULL,
    `nombre` VARCHAR(45) NOT NULL,
    `permisos_db` JSON NOT NULL,
    `permisos_front` JSON NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad_cashclick`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad_cashclick`.`usuario` (
    `id` INT NOT NULL,
    `id_perfil` INT NOT NULL,
    `correo` VARCHAR(45) NOT NULL,
    `nombre` VARCHAR(45) NOT NULL,
    `password` VARCHAR(500) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `id_prf_idx` (`id_perfil` ASC) VISIBLE,
    UNIQUE INDEX `correo_UNIQUE` (`correo` ASC) VISIBLE,
    CONSTRAINT `id_prf` FOREIGN KEY (`id_perfil`) REFERENCES `contabilidad_cashclick`.`perfil` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad_cashclick`.`bitacora`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad_cashclick`.`bitacora` (
    `id` INT NOT NULL,
    `id_transaccion` INT NOT NULL,
    `id_usuario` INT NOT NULL,
    `valor_antes` JSON NOT NULL,
    `valor_despues` JSON NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `id_trb_idx` (`id_transaccion` ASC) VISIBLE,
    INDEX `id_usr_idx` (`id_usuario` ASC) VISIBLE,
    CONSTRAINT `id_trb` FOREIGN KEY (`id_transaccion`) REFERENCES `contabilidad_cashclick`.`transaccion_banco` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `id_trd` FOREIGN KEY (`id_transaccion`) REFERENCES `contabilidad_cashclick`.`transaccion_dwh` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `id_trm` FOREIGN KEY (`id_transaccion`) REFERENCES `contabilidad_cashclick`.`transaccion_mambu` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `id_usr` FOREIGN KEY (`id_usuario`) REFERENCES `contabilidad_cashclick`.`usuario` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `contabilidad_cashclick`.`sesion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `contabilidad_cashclick`.`sesion` (
    `id` INT NOT NULL,
    `id_usuario` INT NOT NULL,
    `token` VARCHAR(45) NOT NULL,
    `creacion` TIMESTAMP(6) NOT NULL,
    `vencimiento` TIMESTAMP(6) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `id_usrs_idx` (`id_usuario` ASC) VISIBLE,
    UNIQUE INDEX `token_UNIQUE` (`token` ASC) VISIBLE,
    CONSTRAINT `id_usrs` FOREIGN KEY (`id_usuario`) REFERENCES `contabilidad_cashclick`.`usuario` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

CREATE USER 'alberto_prod'@'localhost' IDENTIFIED BY 'pruebas_prod';

GRANT INSERT, SELECT, UPDATE, DELETE ON *.* TO 'alberto_prod'@'localhost' WITH GRANT OPTION;

FLUSH PRIVILEGES;