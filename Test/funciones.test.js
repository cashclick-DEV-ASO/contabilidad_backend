import { conciliaCredito } from "./funciones.js"
import { ordenarDatos } from "./funciones.js"
import { obtenLineaError } from "./funciones.js"
import { consultaTrnsBancarias } from "./funciones.js"
import { jsonHTML } from "./funciones.js"
import { aplicaFormatos, formatoFecha, formatoEstatus, formatoModena } from "./funciones.js"
import { recalculaCredito } from "./funciones.js"
import { estadoCuenta } from "./funciones.js"
import { tablaCtasContables } from "./funciones.js"
import { validaCtaContable } from "./funciones.js"

// describe("Conciliación de los cargos contra los abonos de un crédito", () => {
//     const creditoOK = {
//         abono: [
//             { monto: "100", resultado: "" },
//             { monto: "200", resultado: "" },
//             { monto: "300", resultado: "" }
//         ],
//         cargos: [
//             { monto: "100", resultado: "" },
//             { monto: "200", resultado: "" },
//             { monto: "300", resultado: "" }
//         ]
//     }

//     const resultadoOK = {
//         abono: [
//             { monto: "100", resultado: "OK" },
//             { monto: "200", resultado: "OK" },
//             { monto: "300", resultado: "OK" }
//         ],
//         cargos: [
//             { monto: "100", resultado: "OK" },
//             { monto: "200", resultado: "OK" },
//             { monto: "300", resultado: "OK" }
//         ]
//     }

//     const creditoError = {
//         abono: [
//             { monto: "150", resultado: "" },
//             { monto: "200", resultado: "" },
//             { monto: "350", resultado: "" }
//         ],
//         cargos: [
//             { monto: "100", resultado: "" },
//             { monto: "200", resultado: "" },
//             { monto: "200", resultado: "" },
//             { monto: "500", resultado: "" }
//         ]
//     }

//     const resultadoError = {
//         abono: [
//             { monto: "150", resultado: "" },
//             { monto: "200", resultado: "OK" },
//             { monto: "350", resultado: "" }
//         ],
//         cargos: [
//             { monto: "100", resultado: "" },
//             { monto: "200", resultado: "OK" },
//             { monto: "200", resultado: "" },
//             { monto: "500", resultado: "" }
//         ]
//     }
//     test("Todos los créditos OK", () => {
//         expect(conciliaCredito(creditoOK)).toEqual(resultadoOK)
//     })

//     test("Solo una transacción se concilia", () => {
//         expect(conciliaCredito(creditoError)).toEqual(resultadoError)
//     })

//     test("No hay transacciones que conciliar", () => {
//         expect(conciliaCredito({ abono: [], cargos: [] })).toEqual({ abono: [], cargos: [] })
//     })

//     test("No hay cargos que conciliar", () => {
//         expect(conciliaCredito({ abono: [{ monto: "100", resultado: "" }], cargos: [] })).toEqual({
//             abono: [{ monto: "100", resultado: "" }],
//             cargos: []
//         })
//     })

//     test("No hay abonos que conciliar", () => {
//         expect(conciliaCredito({ abono: [], cargos: [{ monto: "100", resultado: "" }] })).toEqual({
//             abono: [],
//             cargos: [{ monto: "100", resultado: "" }]
//         })
//     })
// })

// describe("Ordena las transacciones del reporte de transacciones", () => {
//     const datos = [
//         { credito: 100054058, fecha: Date.parse("2021-01-04"), monto: 6315.74, estatus: "OK" },
//         { credito: 100052056, fecha: Date.parse("2021-01-02"), monto: 2000, estatus: "OK" },
//         { credito: 100051057, fecha: Date.parse("2021-01-03"), monto: 311, estatus: "" },
//         { credito: 100051525, fecha: Date.parse("2021-01-01"), monto: 1000, estatus: "OK" },
//         { credito: 100054674, fecha: Date.parse("2021-01-05"), monto: 315.95, estatus: "OK" }
//     ]

//     test("Ordenar por una columna existente", () => {
//         expect(ordenarDatos(datos, [{ columna: "fecha", desc: false }])).toEqual([
//             { credito: 100051525, fecha: Date.parse("2021-01-01"), monto: 1000, estatus: "OK" },
//             { credito: 100052056, fecha: Date.parse("2021-01-02"), monto: 2000, estatus: "OK" },
//             { credito: 100051057, fecha: Date.parse("2021-01-03"), monto: 311, estatus: "" },
//             { credito: 100054058, fecha: Date.parse("2021-01-04"), monto: 6315.74, estatus: "OK" },
//             { credito: 100054674, fecha: Date.parse("2021-01-05"), monto: 315.95, estatus: "OK" }
//         ])
//     })

//     test("Ordenar por una columna inexistente", () => {
//         expect(ordenarDatos(datos, [{ columna: "inexistente", desc: false }])).toEqual(datos)
//     })

//     test("Ordenar por dos columnas existentes", () => {
//         expect(
//             ordenarDatos(datos, [
//                 { columna: "monto", desc: true },
//                 { columna: "fecha", desc: false }
//             ])
//         ).toEqual([
//             { credito: 100051525, fecha: Date.parse("2021-01-01"), monto: 1000, estatus: "OK" },
//             { credito: 100052056, fecha: Date.parse("2021-01-02"), monto: 2000, estatus: "OK" },
//             { credito: 100051057, fecha: Date.parse("2021-01-03"), monto: 311, estatus: "" },
//             { credito: 100054058, fecha: Date.parse("2021-01-04"), monto: 6315.74, estatus: "OK" },
//             { credito: 100054674, fecha: Date.parse("2021-01-05"), monto: 315.95, estatus: "OK" }
//         ])
//     })

//     test("Ordenar por una columna inexistente y una existente", () => {
//         expect(
//             ordenarDatos(datos, [
//                 { columna: "inexistente", desc: false },
//                 { columna: "fecha", desc: false }
//             ])
//         ).toEqual([
//             { credito: 100051525, fecha: Date.parse("2021-01-01"), monto: 1000, estatus: "OK" },
//             { credito: 100052056, fecha: Date.parse("2021-01-02"), monto: 2000, estatus: "OK" },
//             { credito: 100051057, fecha: Date.parse("2021-01-03"), monto: 311, estatus: "" },
//             { credito: 100054058, fecha: Date.parse("2021-01-04"), monto: 6315.74, estatus: "OK" },
//             { credito: 100054674, fecha: Date.parse("2021-01-05"), monto: 315.95, estatus: "OK" }
//         ])
//     })

//     test("Ordenar por una columna existente y una inexistente", () => {
//         expect(
//             ordenarDatos(datos, [
//                 { columna: "fecha", desc: false },
//                 { columna: "inexistente", desc: false }
//             ])
//         ).toEqual([
//             { credito: 100051525, fecha: Date.parse("2021-01-01"), monto: 1000, estatus: "OK" },
//             { credito: 100052056, fecha: Date.parse("2021-01-02"), monto: 2000, estatus: "OK" },
//             { credito: 100051057, fecha: Date.parse("2021-01-03"), monto: 311, estatus: "" },
//             { credito: 100054058, fecha: Date.parse("2021-01-04"), monto: 6315.74, estatus: "OK" },
//             { credito: 100054674, fecha: Date.parse("2021-01-05"), monto: 315.95, estatus: "OK" }
//         ])
//     })

//     test("Ordenar por dos columnas inexistentes", () => {
//         expect(
//             ordenarDatos(datos, [
//                 { columna: "inexistente1", desc: false },
//                 { columna: "inexistente2", desc: false }
//             ])
//         ).toEqual(datos)
//     })
// })

// describe("Obtiene la línea y columna del error", () => {
//     const error = {
//         stack: `VM994:1 Uncaught SyntaxError: Expected property name or '}' in JSON at position 1 (line 1 column 2)
//         at JSON.parse (<anonymous>)
//         at <anonymous>:1:6`
//     }

//     test("Obtener línea y columna del error", () => {
//         expect(obtenLineaError(error)).toEqual({ lineaError: "1", columnaError: "2" })
//     })

//     test("No se proporciona un error", () => {
//         expect(obtenLineaError()).toEqual({ lineaError: null, columnaError: null })
//     })

//     test("Se proporciona un error sin stack", () => {
//         expect(obtenLineaError({})).toEqual({ lineaError: 0, columnaError: 0 })
//     })
// })

// describe("Generacion de consulta para las transacciones bancarias", () => {
//     const queryBase =
//         "SELECT informacion, fecha_creacion, fecha_valor, concepto, tipo, monto FROM transaccion_banco"

//     test("Consulta sin filtros", () => {
//         expect(consultaTrnsBancarias({})).toEqual({
//             query: queryBase,
//             parametros: []
//         })
//     })

//     test("Consulta con fecha inicial", () => {
//         expect(
//             consultaTrnsBancarias({
//                 fechaI: "2021-01-01"
//             })
//         ).toEqual({
//             query: queryBase + " WHERE fecha_creacion >= ?",
//             parametros: ["2021-01-01"]
//         })
//     })

//     test("Consulta con fecha final", () => {
//         expect(
//             consultaTrnsBancarias({
//                 fechaF: "2021-01-01"
//             })
//         ).toEqual({
//             query: queryBase + " WHERE fecha_creacion <= ?",
//             parametros: ["2021-01-01"]
//         })
//     })

//     test("Consulta con banco", () => {
//         expect(
//             consultaTrnsBancarias({
//                 banco: 1
//             })
//         ).toEqual({
//             query:
//                 queryBase +
//                 " WHERE id_edo_cta in (SELECT id_edo_cta FROM edo_cta WHERE id_cuenta = ?)",
//             parametros: [1]
//         })
//     })

//     test("Consulta con fecha inicial, fecha final y banco", () => {
//         expect(
//             consultaTrnsBancarias({
//                 fechaI: "2021-01-01",
//                 fechaF: "2021-01-01",
//                 banco: 1
//             })
//         ).toEqual({
//             query:
//                 queryBase +
//                 " WHERE fecha_creacion >= ? AND fecha_creacion <= ? AND id_edo_cta in (SELECT id_edo_cta FROM edo_cta WHERE id_cuenta = ?)",
//             parametros: ["2021-01-01", "2021-01-01", 1]
//         })
//     })
// })

// describe("Convierte un array de objetos JSON en una tabla HTML", () => {
//     const datos = [
//         { credito: 100054058, fecha: "2021-01-04", monto: 6315.74, estatus: "OK" },
//         { credito: 100052056, fecha: "2021-01-02", monto: 2000, estatus: "OK" },
//         { credito: 100051057, fecha: "2021-01-03", monto: 311, estatus: "" },
//         { credito: 100051525, fecha: "2021-01-01", monto: 1000, estatus: "OK" },
//         { credito: 100054674, fecha: "2021-01-05", monto: 315.95, estatus: "OK" }
//     ]

//     const encabezados = ["No. Credito", "Fecha Valor", "Pago", "Conciliado"]

//     test("Se envía un array con objetos JSON", () => {
//         const tablaHTML =
//             "<table><tr><th>credito</th><th>fecha</th><th>monto</th><th>estatus</th></tr><tr><td>100054058</td><td>2021-01-04</td><td>6315.74</td><td>OK</td></tr><tr><td>100052056</td><td>2021-01-02</td><td>2000</td><td>OK</td></tr><tr><td>100051057</td><td>2021-01-03</td><td>311</td><td></td></tr><tr><td>100051525</td><td>2021-01-01</td><td>1000</td><td>OK</td></tr><tr><td>100054674</td><td>2021-01-05</td><td>315.95</td><td>OK</td></tr></table>"

//         expect(jsonHTML(datos)).toEqual(tablaHTML)
//     })

//     test("Se envía un array vacío", () => {
//         expect(jsonHTML([])).toEqual("<p>No hay datos para mostrar.</p>")
//     })

//     test("Se envía un array con un objeto JSON vacío", () => {
//         expect(jsonHTML([{}])).toEqual("<p>No hay datos para mostrar.</p>")
//     })

//     test("Se envía un objeto JSON", () => {
//         expect(jsonHTML({})).toEqual("<p>No hay datos para mostrar.</p>")
//     })

//     test("Se envía un array con objetos JSON y encabezados", () => {
//         const tablaHTML = `<table><tr><th>No. Credito</th><th>Fecha Valor</th><th>Pago</th><th>Conciliado</th></tr><tr><td>100054058</td><td>2021-01-04</td><td>6315.74</td><td>OK</td></tr><tr><td>100052056</td><td>2021-01-02</td><td>2000</td><td>OK</td></tr><tr><td>100051057</td><td>2021-01-03</td><td>311</td><td></td></tr><tr><td>100051525</td><td>2021-01-01</td><td>1000</td><td>OK</td></tr><tr><td>100054674</td><td>2021-01-05</td><td>315.95</td><td>OK</td></tr></table>`

//         expect(jsonHTML(datos, encabezados)).toEqual(tablaHTML)
//     })

//     test("Se envía un array vacío y encabezados", () => {
//         expect(jsonHTML([], encabezados)).toEqual("<p>No hay datos para mostrar.</p>")
//     })

//     test("Se envía un array con un objeto JSON vacío y encabezados", () => {
//         expect(jsonHTML([{}], encabezados)).toEqual(
//             "<table><tr><th>No. Credito</th><th>Fecha Valor</th><th>Pago</th><th>Conciliado</th></tr><tr></tr></table>"
//         )
//     })

//     test("Se envía un objeto JSON y encabezados", () => {
//         expect(jsonHTML({}, encabezados)).toEqual("<p>No hay datos para mostrar.</p>")
//     })
// })

// describe("Aplica formatos a los datos enviados", () => {
//     const datos = [
//         { credito: 100054058, fecha: "2021-01-04", monto: 6315.74, estatus: "OK" },
//         { credito: 100052056, fecha: "2021-01-02", monto: 2000, estatus: "OK" },
//         { credito: 100051057, fecha: "2021-01-03", monto: 311, estatus: "" },
//         { credito: 100051525, fecha: "2021-01-01", monto: 1000, estatus: "OK" },
//         { credito: 100054674, fecha: "2021-01-05", monto: 315.95, estatus: "OK" }
//     ]

//     test("Se envían datos y formatos", () => {
//         expect(
//             aplicaFormatos(datos, [
//                 { columna: "monto", formato: formatoModena },
//                 { columna: "fecha", formato: formatoFecha },
//                 { columna: "estatus", formato: formatoEstatus }
//             ])
//         ).toEqual([
//             { credito: 100054058, fecha: "04/01/2021", monto: "$6,315.74", estatus: "✔️" },
//             { credito: 100052056, fecha: "02/01/2021", monto: "$2,000.00", estatus: "✔️" },
//             { credito: 100051057, fecha: "03/01/2021", monto: "$311.00", estatus: "❌" },
//             { credito: 100051525, fecha: "01/01/2021", monto: "$1,000.00", estatus: "✔️" },
//             { credito: 100054674, fecha: "05/01/2021", monto: "$315.95", estatus: "✔️" }
//         ])
//     })

//     test("Se envían datos sin formato", () => {
//         expect(aplicaFormatos(datos, [])).toEqual(datos)
//     })

//     test("Se envía un array vació y formatos", () => {
//         expect(aplicaFormatos([], [{ columna: "monto", formato: formatoModena }])).toEqual([])
//     })

//     test("No se envían datos", () => {
//         expect(aplicaFormatos()).toEqual(undefined)
//     })

//     test("No se envían formatos", () => {
//         expect(aplicaFormatos(datos)).toEqual(datos)
//     })

//     test("Se envía un objeto JSON y formatos", () => {
//         expect(aplicaFormatos({}, [{ columna: "monto", formato: formatoModena }])).toEqual({})
//     })

//     test("Se envía un objeto JSON sin formato", () => {
//         expect(aplicaFormatos({})).toEqual({})
//     })
// })

// describe("Genera el recálculo del capital de un crédito", () => {
//     const credito = {
//         idCredito: 1,
//         monto: 1000,
//         dias: 7,
//         plazo: 8,
//         fechaInicio: "2021-01-01",
//         interes: 0.18
//     }

//     const recalculo = [
//         {
//             fecha: "2021-01-01",
//             capital: "17.86",
//             intereses: "0.50",
//             saldo: "982.14",
//             totalAbonado: "18.36",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-02",
//             capital: "35.71",
//             intereses: "1.00",
//             saldo: "964.29",
//             totalAbonado: "36.71",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-03",
//             capital: "53.57",
//             intereses: "1.50",
//             saldo: "946.43",
//             totalAbonado: "55.07",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-04",
//             capital: "71.43",
//             intereses: "2.00",
//             saldo: "928.57",
//             totalAbonado: "73.43",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-05",
//             capital: "89.29",
//             intereses: "2.50",
//             saldo: "910.71",
//             totalAbonado: "91.79",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-06",
//             capital: "107.14",
//             intereses: "3.00",
//             saldo: "892.86",
//             totalAbonado: "110.14",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-07",
//             capital: "125.00",
//             intereses: "3.50",
//             saldo: "875.00",
//             totalAbonado: "128.50",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-08",
//             capital: "142.86",
//             intereses: "4.00",
//             saldo: "857.14",
//             totalAbonado: "146.86",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-09",
//             capital: "160.71",
//             intereses: "4.50",
//             saldo: "839.29",
//             totalAbonado: "165.21",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-10",
//             capital: "178.57",
//             intereses: "5.00",
//             saldo: "821.43",
//             totalAbonado: "183.57",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-11",
//             capital: "196.43",
//             intereses: "5.50",
//             saldo: "803.57",
//             totalAbonado: "201.93",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-12",
//             capital: "214.29",
//             intereses: "6.00",
//             saldo: "785.71",
//             totalAbonado: "220.29",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-13",
//             capital: "232.14",
//             intereses: "6.50",
//             saldo: "767.86",
//             totalAbonado: "238.64",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-14",
//             capital: "250.00",
//             intereses: "7.00",
//             saldo: "750.00",
//             totalAbonado: "257.00",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-15",
//             capital: "267.86",
//             intereses: "7.50",
//             saldo: "732.14",
//             totalAbonado: "275.36",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-16",
//             capital: "285.71",
//             intereses: "8.00",
//             saldo: "714.29",
//             totalAbonado: "293.71",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-17",
//             capital: "303.57",
//             intereses: "8.50",
//             saldo: "696.43",
//             totalAbonado: "312.07",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-18",
//             capital: "321.43",
//             intereses: "9.00",
//             saldo: "678.57",
//             totalAbonado: "330.43",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-19",
//             capital: "339.29",
//             intereses: "9.50",
//             saldo: "660.71",
//             totalAbonado: "348.79",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-20",
//             capital: "357.14",
//             intereses: "10.00",
//             saldo: "642.86",
//             totalAbonado: "367.14",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-21",
//             capital: "375.00",
//             intereses: "10.50",
//             saldo: "625.00",
//             totalAbonado: "385.50",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-22",
//             capital: "392.86",
//             intereses: "11.00",
//             saldo: "607.14",
//             totalAbonado: "403.86",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-23",
//             capital: "410.71",
//             intereses: "11.50",
//             saldo: "589.29",
//             totalAbonado: "422.21",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-24",
//             capital: "428.57",
//             intereses: "12.00",
//             saldo: "571.43",
//             totalAbonado: "440.57",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-25",
//             capital: "446.43",
//             intereses: "12.50",
//             saldo: "553.57",
//             totalAbonado: "458.93",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-26",
//             capital: "464.29",
//             intereses: "13.00",
//             saldo: "535.71",
//             totalAbonado: "477.29",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-27",
//             capital: "482.14",
//             intereses: "13.50",
//             saldo: "517.86",
//             totalAbonado: "495.64",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-28",
//             capital: "500.00",
//             intereses: "14.00",
//             saldo: "500.00",
//             totalAbonado: "514.00",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-29",
//             capital: "517.86",
//             intereses: "14.50",
//             saldo: "482.14",
//             totalAbonado: "532.36",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-30",
//             capital: "535.71",
//             intereses: "15.00",
//             saldo: "464.29",
//             totalAbonado: "550.71",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-01-31",
//             capital: "553.57",
//             intereses: "15.50",
//             saldo: "446.43",
//             totalAbonado: "569.07",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-02-01",
//             capital: "571.43",
//             intereses: "16.00",
//             saldo: "428.57",
//             totalAbonado: "587.43",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-02-02",
//             capital: "589.29",
//             intereses: "16.50",
//             saldo: "410.71",
//             totalAbonado: "605.79",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-02-03",
//             capital: "607.14",
//             intereses: "17.00",
//             saldo: "392.86",
//             totalAbonado: "624.14",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-02-04",
//             capital: "625.00",
//             intereses: "17.50",
//             saldo: "375.00",
//             totalAbonado: "642.50",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-02-05",
//             capital: "642.86",
//             intereses: "18.00",
//             saldo: "357.14",
//             totalAbonado: "660.86",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-02-06",
//             capital: "660.71",
//             intereses: "18.50",
//             saldo: "339.29",
//             totalAbonado: "679.21",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-02-07",
//             capital: "678.57",
//             intereses: "19.00",
//             saldo: "321.43",
//             totalAbonado: "697.57",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-02-08",
//             capital: "696.43",
//             intereses: "19.50",
//             saldo: "303.57",
//             totalAbonado: "715.93",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-02-09",
//             capital: "714.29",
//             intereses: "20.00",
//             saldo: "285.71",
//             totalAbonado: "734.29",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-02-10",
//             capital: "732.14",
//             intereses: "20.50",
//             saldo: "267.86",
//             totalAbonado: "752.64",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-02-11",
//             capital: "750.00",
//             intereses: "21.00",
//             saldo: "250.00",
//             totalAbonado: "771.00",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-02-12",
//             capital: "767.86",
//             intereses: "21.50",
//             saldo: "232.14",
//             totalAbonado: "789.36",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-02-13",
//             capital: "785.71",
//             intereses: "22.00",
//             saldo: "214.29",
//             totalAbonado: "807.71",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-02-14",
//             capital: "803.57",
//             intereses: "22.50",
//             saldo: "196.43",
//             totalAbonado: "826.07",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-02-15",
//             capital: "821.43",
//             intereses: "23.00",
//             saldo: "178.57",
//             totalAbonado: "844.43",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-02-16",
//             capital: "839.29",
//             intereses: "23.50",
//             saldo: "160.71",
//             totalAbonado: "862.79",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-02-17",
//             capital: "857.14",
//             intereses: "24.00",
//             saldo: "142.86",
//             totalAbonado: "881.14",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-02-18",
//             capital: "875.00",
//             intereses: "24.50",
//             saldo: "125.00",
//             totalAbonado: "899.50",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-02-19",
//             capital: "892.86",
//             intereses: "25.00",
//             saldo: "107.14",
//             totalAbonado: "917.86",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-02-20",
//             capital: "910.71",
//             intereses: "25.50",
//             saldo: "89.29",
//             totalAbonado: "936.21",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-02-21",
//             capital: "928.57",
//             intereses: "26.00",
//             saldo: "71.43",
//             totalAbonado: "954.57",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-02-22",
//             capital: "946.43",
//             intereses: "26.50",
//             saldo: "53.57",
//             totalAbonado: "972.93",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-02-23",
//             capital: "964.29",
//             intereses: "27.00",
//             saldo: "35.71",
//             totalAbonado: "991.29",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-02-24",
//             capital: "982.14",
//             intereses: "27.50",
//             saldo: "17.86",
//             totalAbonado: "1009.64",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         },
//         {
//             fecha: "2021-02-25",
//             capital: "1000.00",
//             intereses: "28.00",
//             saldo: "-0.00",
//             totalAbonado: "1028.00",
//             pagoRequerido: "18.36",
//             interesRequerido: "0.50",
//             capitalRequerido: "17.86"
//         }
//     ]

//     test("Se envían los datos del crédito", () => {
//         expect(recalculaCredito(credito)).toEqual(recalculo)
//     })

//     test("No se envían los datos del crédito", () => {
//         expect(recalculaCredito()).toEqual([])
//     })

//     test("Se envía un objeto JSON vacío", () => {
//         expect(recalculaCredito({})).toEqual([])
//     })

//     test("Se envía un array vacío", () => {
//         expect(recalculaCredito([])).toEqual([])
//     })
// })

// describe("Generación del estado de cuenta del cliente", () => {
//     const credito = {
//         idCredito: 1,
//         monto: 1000,
//         interes: 27.5,
//         plazo: 8,
//         tasa: 18,
//         fechaInicio: formatoFecha("2021-01-01")
//     }

//     const pagos = [
//         {
//             fecha: "2021-01-01",
//             medio: "Conekta",
//             monto: 500,
//             capital: 350,
//             intereses: 150,
//             iva: 18.36,
//             moratorios: 0,
//             ivaMoratorios: 0,
//             saldo: 650
//         },
//         {
//             fecha: "2021-01-30",
//             medio: "Conekta",
//             monto: 200,
//             capital: 50,
//             intereses: 40,
//             iva: 1.36,
//             moratorios: 80,
//             ivaMoratorios: 6.88,
//             saldo: 300
//         },
//         {
//             fecha: "2021-02-01",
//             medio: "Conekta",
//             monto: 300,
//             capital: 250,
//             intereses: 50,
//             iva: 9.36,
//             moratorios: 0,
//             ivaMoratorios: 0,
//             saldo: 0
//         }
//     ]

//     const estadoCta = `<h2>Estado de cuenta</h2>
// <p>Crédito: 1</p>
// <p>Saldo: $1,000.00</p>
// <p>Interés: $27.50</p>
// <p>Plazo: 8</p>
// <p>Tasa Anual: 18%</p>
// <p>Fecha de inicio: 01/01/2021</p>
// <table>
// <tr>
// <th>Fecha</th>
// <th>Medio</th>
// <th>Pago realizado</th>
// <th>Capital</th>
// <th>Interés</th>
// <th>IVA</th>
// <th>Moratorios</th>
// <th>IVA Moratorios</th>
// <th>Saldo</th>
// </tr>
// <tr>
// <td>2021-01-01</td>
// <td>Conekta</td>
// <td>500</td>
// <td>350</td>
// <td>150</td>
// <td>18.36</td>
// <td>0</td>
// <td>0</td>
// <td>650</td>
// </tr>
// <tr>
// <td>2021-01-30</td>
// <td>Conekta</td>
// <td>200</td>
// <td>50</td>
// <td>40</td>
// <td>1.36</td>
// <td>80</td>
// <td>6.88</td>
// <td>300</td>
// </tr>
// <tr>
// <td>2021-02-01</td>
// <td>Conekta</td>
// <td>300</td>
// <td>250</td>
// <td>50</td>
// <td>9.36</td>
// <td>0</td>
// <td>0</td>
// <td>0</td>
// </tr>
// </table>`

//     const estadoCtaVacio = `<h2>Estado de cuenta</h2>
// <p>Crédito: 1</p>
// <p>Saldo: $1,000.00</p>
// <p>Interés: $27.50</p>
// <p>Plazo: 8</p>
// <p>Tasa Anual: 18%</p>
// <p>Fecha de inicio: 01/01/2021</p>
// <table>
// <tr>
// <th>Fecha</th>
// <th>Medio</th>
// <th>Pago realizado</th>
// <th>Capital</th>
// <th>Interés</th>
// <th>IVA</th>
// <th>Moratorios</th>
// <th>IVA Moratorios</th>
// <th>Saldo</th>
// </tr>
// <tr><td colspan='9'>No hay pagos registrados</td></tr></table>`

//     test("Se envían los datos del crédito y los pagos", () => {
//         expect(estadoCuenta(credito, pagos)).toEqual(estadoCta)
//     })

//     test("No se envían los datos del crédito pero se envían pagos", () => {
//         expect(estadoCuenta()).toEqual("<p>El cliente no tiene un crédito vigente.</p>")
//     })

//     test("Se envían datos del crédito pero no se envían pagos", () => {
//         expect(estadoCuenta(credito)).toEqual(estadoCtaVacio)
//     })

//     test("No se envían los datos del crédito", () => {
//         expect(estadoCuenta()).toEqual("<p>El cliente no tiene un crédito vigente.</p>")
//     })

//     test("Se envía un objeto JSON vacío", () => {
//         expect(estadoCuenta({})).toEqual("<p>Error al mostrar la información.</p>")
//     })

//     test("Se envía un array vacío", () => {
//         expect(estadoCuenta([])).toEqual("<p>Error al mostrar la información.</p>")
//     })
// })

// describe("Generación de la tabla de cuentas contables", () => {
//     const ctasEjemplo = {
//         100000_100000: {
//             100001: {
//                 saldo_inicial: 100000,
//                 cargos: 1000,
//                 abonos: 0,
//                 saldo_final: 99000
//             },
//             100002: {
//                 saldo_inicial: 99000,
//                 cargos: 500,
//                 abonos: 0,
//                 saldo_final: 98500
//             }
//         },
//         100000_200000: {
//             200001: {
//                 saldo_inicial: 100000,
//                 cargos: 1000,
//                 abonos: 0,
//                 saldo_final: 99000
//             },
//             200002: {
//                 saldo_inicial: 99000,
//                 cargos: 500,
//                 abonos: 0,
//                 saldo_final: 98500
//             }
//         }
//     }

//     const tablaEjemplo =
//         '<table><tr><th>Cuenta</th><th>Subcuenta</th><th>Saldo Inicial</th><th>Cargos</th><th>Abonos</th><th>Saldo Final</th></tr><tr><td rowspan="2">100000100000</td><td>100001</td><td>100000</td><td>1000</td><td>0</td><td>99000</td></tr><tr><td rowspan="2">100000200000</td><td>100002</td><td>99000</td><td>500</td><td>0</td><td>98500</td></tr><tr>colCta<td>200001</td><td>100000</td><td>1000</td><td>0</td><td>99000</td></tr><tr>colCta<td>200002</td><td>99000</td><td>500</td><td>0</td><td>98500</td></tr></table>'

//     test("Se envían los datos de las cuentas", () => {
//         expect(tablaCtasContables(ctasEjemplo)).toEqual(tablaEjemplo)
//     })

//     test("No se envían los datos de las cuentas", () => {
//         expect(tablaCtasContables()).toEqual("<p>No hay datos para mostrar.</p>")
//     })

//     test("Se envía un objeto JSON vacío", () => {
//         expect(tablaCtasContables({})).toEqual("<p>No hay datos para mostrar.</p>")
//     })

//     test("Se envía un array vacío", () => {
//         expect(tablaCtasContables([])).toEqual("<p>No hay datos para mostrar.</p>")
//     })
// })

describe("Validación de cuentas contables", () => {
    const ctasEjemplo = {
        100000: {
            100001: {
                saldo_inicial: 100000,
                cargos: 1000,
                abonos: 0,
                saldo_final: 99000
            },
            100002: {
                saldo_inicial: 99000,
                cargos: 500,
                abonos: 0,
                saldo_final: 98500
            }
        },
        200000: {
            200001: {
                saldo_inicial: 100000,
                cargos: 0,
                abonos: 1000,
                saldo_final: 101000
            },
            200002: {
                saldo_inicial: 99000,
                cargos: 0,
                abonos: 500,
                saldo_final: 99500
            }
        }
    }

    test("Se envían los datos sin diferencias", () => {
        expect(validaCtaContable(ctasEjemplo)).toEqual([])
    })

    test("Se envían los datos con diferencias en los saldos", () => {
        ctasEjemplo[100000][100001].saldo_final = 99001
        expect(validaCtaContable(ctasEjemplo)).toEqual([
            {
                cta: "100000",
                subcta: "100001",
                saldo_inicial: 100000,
                cargos: 1000,
                abonos: 0,
                saldo_final: 99001,
                diferencia: -1
            }
        ])
    })

    test("No se envían los datos de las cuentas", () => {
        expect(validaCtaContable()).toEqual(null)
    })

    test("Se envía un objeto JSON vacío", () => {
        expect(validaCtaContable({})).toEqual([])
    })

    test("Se envía un array vacío", () => {
        expect(validaCtaContable([])).toEqual([])
    })
})
