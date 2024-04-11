import e from "express"

export const conciliaCredito = (credito) => {
    credito.abono.forEach((abono) => {
        if (abono.resultado === "OK") return

        for (let indexC = 0; indexC < credito.cargos.length; indexC++) {
            const cargo = credito.cargos[indexC]
            if (
                parseFloat(abono.monto) === parseFloat(cargo.monto) ||
                parseFloat(abono.monto) + parseFloat(cargo.monto) === 0
            ) {
                abono.resultado = "OK"
                credito.cargos[indexC].resultado = "OK"

                break
            }
        }
    })

    return credito
}

export const ordenarDatos = (datos, parametros) => {
    const datosOrdenados = [...datos]

    for (const parametro of parametros) {
        const { columna, desc } = parametro

        datosOrdenados.sort((a, b) => {
            if (a[columna] < b[columna]) return desc ? 1 : -1
            if (a[columna] > b[columna]) return desc ? -1 : 1
            return 0
        })
    }

    return datosOrdenados
}

export const obtenLineaError = (error) => {
    if (!error) return { lineaError: null, columnaError: null }
    if (!error.stack) return { lineaError: 0, columnaError: 0 }
    const lineas = error.stack.split("\n")
    const linea = lineas[0].trim()
    const inicio = linea.indexOf("(") + 1
    const fin = linea.indexOf(")")
    const ruta = linea.substring(inicio, fin).split(" ")
    const lineaError = ruta[1]
    const columnaError = ruta[3]
    return { lineaError, columnaError }
}

export const consultaTrnsBancarias = (datos) => {
    const filtros = []
    const parametros = []

    if (datos.fechaI) {
        filtros.push("fecha_creacion >= ?")
        parametros.push(datos.fechaI)
    }

    if (datos.fechaF) {
        filtros.push("fecha_creacion <= ?")
        parametros.push(datos.fechaF)
    }

    if (datos.banco) {
        filtros.push("id_edo_cta in (SELECT id_edo_cta FROM edo_cta WHERE id_cuenta = ?)")
        parametros.push(datos.banco)
    }

    let query =
        "SELECT informacion, fecha_creacion, fecha_valor, concepto, tipo, monto FROM transaccion_banco"

    if (filtros.length > 0) {
        query += ` WHERE ${filtros.join(" AND ")}`
    }

    const datosEnvio = {
        query,
        parametros
    }

    return datosEnvio
}

export const jsonHTML = (datos, encabezados = null) => {
    if (!Array.isArray(datos) || datos.length === 0) return "<p>No hay datos para mostrar.</p>"
    if (encabezados === null) encabezados = Object.keys(datos[0]).map((encabezado) => encabezado)
    if (encabezados.length === 0) return "<p>No hay datos para mostrar.</p>"

    let tabla = "<table><tr>"
    encabezados.forEach((encabezado) => {
        tabla += `<th>${encabezado}</th>`
    })
    tabla += "</tr>"
    datos.forEach((dato) => {
        tabla += "<tr>"
        Object.values(dato).forEach((valor) => {
            tabla += `<td>${valor}</td>`
        })
        tabla += "</tr>"
    })
    tabla += "</table>"
    return tabla
}

export const aplicaFormatos = (datos, formatos) => {
    if (!Array.isArray(datos) || datos.length === 0) return datos
    if (!Array.isArray(formatos) || formatos.length === 0) return datos

    const datosFormateados = [...datos]

    for (const formato of formatos) {
        const { columna, formato: formatoColumna } = formato
        datosFormateados.forEach((dato) => {
            dato[columna] = formatoColumna(dato[columna])
        })
    }

    return datosFormateados
}

export const formatoModena = (dato) => {
    const numero = parseFloat(dato)
    if (isNaN(numero)) return dato

    return numero.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN"
    })
}

export const formatoFecha = (dato) => {
    const fecha = dato.split("-")
    return `${fecha[2]}/${fecha[1]}/${fecha[0]}`
}

export const formatoEstatus = (dato) => {
    return dato === "OK" ? "✔️" : "❌"
}

export const recalculaCredito = (credito) => {
    if (!credito) return []
    const resultado = []

    const dias = credito.dias
    const plazo = credito.plazo
    const diasPlazo = dias * plazo
    const monto = credito.monto
    const fechaInicio = new Date(credito.fechaInicio)
    const interes = credito.interes
    let fechaFin = new Date(fechaInicio)
    fechaFin.setDate(fechaFin.getDate() + diasPlazo)
    const interesDiario = monto * (interes / 360)
    const capitalDiario = monto / diasPlazo
    let capital = 0
    let intereses = 0

    for (let dia = 0; dia < diasPlazo; dia++) {
        const fecha = new Date(fechaInicio)
        fecha.setDate(fecha.getDate() + dia)
        capital += capitalDiario
        intereses += interesDiario
        resultado.push({
            fecha: fecha.toISOString().split("T")[0],
            capital: capital.toFixed(2),
            intereses: intereses.toFixed(2),
            saldo: (monto - capital).toFixed(2),
            totalAbonado: (capital + intereses).toFixed(2),
            pagoRequerido: (interesDiario + capitalDiario).toFixed(2),
            interesRequerido: interesDiario.toFixed(2),
            capitalRequerido: capitalDiario.toFixed(2)
        })
    }

    return resultado
}

export const estadoCuenta = (credito, pagos) => {
    if (!credito) return "<p>El cliente no tiene un crédito vigente.</p>"
    if (!credito.idCredito) return "<p>Error al mostrar la información.</p>"

    let tabla = `<h2>Estado de cuenta</h2>
<p>Crédito: ${credito.idCredito}</p>
<p>Saldo: ${credito.monto.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN"
    })}</p>
<p>Interés: ${credito.interes.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN"
    })}</p>
<p>Plazo: ${credito.plazo}</p>
<p>Tasa Anual: ${credito.tasa}%</p>
<p>Fecha de inicio: ${credito.fechaInicio}</p>
<table>
<tr>
<th>Fecha</th><th>Medio</th><th>Pago realizado</th><th>Capital</th><th>Interés</th><th>IVA</th><th>Moratorios</th><th>IVA Moratorios</th><th>Saldo</th>
</tr>`
    if (!Array.isArray(pagos) || pagos.length === 0) {
        tabla += "<tr><td colspan='9'>No hay pagos registrados</td></tr>"
    } else {
        pagos.forEach((pago) => {
            tabla += `<tr>
<td>${pago.fecha}</td><td>${pago.medio}</td><td>${pago.monto}</td><td>${pago.capital}</td><td>${pago.intereses}</td><td>${pago.iva}</td><td>${pago.moratorios}</td><td>${pago.ivaMoratorios}</td><td>${pago.saldo}</td>
</tr>`
        })
    }
    tabla += "</table>"
    return tabla
}

export const tablaCtasContables = (datos) => {
    if (!datos) return "<p>No hay datos para mostrar.</p>"
    if (Object.keys(datos).length === 0) return "<p>No hay datos para mostrar.</p>"

    let tabla =
        "<table><tr><th>Cuenta</th><th>Subcuenta</th><th>Saldo Inicial</th><th>Cargos</th><th>Abonos</th><th>Saldo Final</th></tr>"
    Object.keys(datos).forEach((cta) => {
        let filas = 0
        Object.keys(datos[cta]).forEach((subcta) => {
            const { saldo_inicial, cargos, abonos, saldo_final } = datos[cta][subcta]
            tabla += `<tr>colCta<td>${subcta}</td><td>${saldo_inicial}</td><td>${cargos}</td><td>${abonos}</td><td>${saldo_final}</td></tr>`
            filas++
        })
        const colCta = `<td rowspan="${filas}">${cta}</td>`
        tabla = tabla.replace("colCta", colCta)
    })

    tabla += "</table>"
    return tabla
}

export const validaCtaContable = (datos) => {
    if (!datos) return null

    let resultado = []

    Object.keys(datos).forEach((cta) => {
        Object.keys(datos[cta]).forEach((subcta) => {
            const { saldo_inicial, cargos, abonos, saldo_final } = datos[cta][subcta]
            if (saldo_inicial + abonos - cargos !== saldo_final)
                resultado.push({
                    cta,
                    subcta,
                    saldo_inicial,
                    cargos,
                    abonos,
                    saldo_final,
                    diferencia: saldo_inicial + abonos - cargos - saldo_final
                })
        })
    })

    return resultado
}
