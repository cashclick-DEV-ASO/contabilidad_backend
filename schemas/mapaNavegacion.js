const mapaJSON = {
    inicio: { titulo: "Inicio", vista: "Inicio" },
    transacciones: {
        titulo: "Transacciones",
        vista: {
            saldos: {
                titulo: "Saldos Contables",
                vista: {
                    registro: { titulo: "Registro", vista: "RegSaldos" },
                    consulta: { titulo: "Consulta", vista: "ConSaldos" }
                }
            },
            bancos: {
                titulo: "Bancos",
                vista: {
                    registro: { titulo: "Registro", vista: "RegTrnBancos" },
                    consulta: { titulo: "Consulta", vista: "ConTrnBancos" }
                }
            },
            dwh: {
                titulo: "DWH",
                vista: {
                    registro: { titulo: "Registro", vista: "RegTrnDWH" },
                    consulta: { titulo: "Consulta", vista: "ConTrnDWH" }
                }
            },
            mambu: {
                titulo: "Mambu",
                vista: {
                    registro: { titulo: "Registro", vista: "RegTrnMambu" },
                    consulta: { titulo: "Consulta", vista: "ConTrnMambu" }
                }
            }
        }
    },
    conciliacion: {
        titulo: "Conciliación",
        vista: {
            conciliar: { titulo: "Conciliación Automática", vista: "Conciliar" },
            consulta: { titulo: "Consulta Conciliados", vista: "ConConciliacion" },
            noConciliado: { titulo: "Conciliación Manual", vista: "ConNoConciliacion" }
        }
    },
    reportes: {
        titulo: "Reportes",
        vista: {
            resConciliacion: { titulo: "Resumen Conciliación", vista: "ResConciliacion" },
            saf: { titulo: "Saldo a Favor", vista: "ResSaldoFavor" },
            recalculoInteres: { titulo: "Recalculo de Interés", vista: "RecalculoInteres" },
            recalculoCapital: { titulo: "Recalculo de Capital", vista: "RecalculoCapital" },
            cartera: { titulo: "Cartera", vista: "Cartera" },
            aclaraciones: {
                titulo: "Aclaraciones",
                vista: {
                    registro: { titulo: "Registro", vista: "RegAclaraciones" },
                    consulta: { titulo: "Consulta", vista: "ConAclaraciones" }
                }
            },
            ajustes: { titulo: "Ajustes", vista: "Ajustes" },
            edoCta: { titulo: "Estado de Cuenta", vista: "EdoCta" }
        }
    },
    administracion: {
        titulo: "Administración",
        vista: {
            cuentasBancarias: {
                titulo: "Cuentas Bancarias",
                vista: {
                    registro: { titulo: "Registro", vista: "RegCtasBancarias" },
                    consulta: { titulo: "Consulta", vista: "ConCtasBancarias" }
                }
            },
            cuentasContables: {
                titulo: "Cuentas Contables",
                vista: {
                    registro: { titulo: "Registro", vista: "RegCtasContables" },
                    consulta: { titulo: "Consulta", vista: "ConCtasContables" }
                }
            },
            plantillas: {
                titulo: "Plantillas",
                vista: {
                    layout: { titulo: "Layout", vista: "Layout" },
                    Etiquetas: { titulo: "Etiquetas", vista: "Etiquetas" }
                }
            },
            variables: { titulo: "Variables", vista: "Variables" }
        }
    },
    logout: { titulo: "Salir", vista: "Logout" }
}

export default mapaJSON
