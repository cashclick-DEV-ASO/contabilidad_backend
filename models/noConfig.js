import { Modelo } from "./modelo.js"

export class NoConfigModelo extends Modelo {
    constructor(db) {
        super(db)
    }

    async post(datos) {
        let conexion = null
        let mensaje = "Consulta ejecutada correctamente."
        let error = null
        let resultado = null

        if (!datos)
            return console.log("La función post de la clase NoConfigModelo, no recibió datos.")

        try {
            conexion = await this.db.getConnection()

            conexion.beginTransaction()
            const { query, parametros } = datos
            if (parametros[0] === "MODO_MULTIPLE") {
                const queries = query.split(";")
                for (let i = 0; i < queries.length; i++) {
                    let q = queries[i].trim()
                    if (!q) continue
                    let r = await conexion.query(q, [])
                    if (r[0].affectedRows === 0)
                        throw new Error(`Error al ejecutar la consulta ${i + 1} (${queries[i]}).`)
                }
                resultado = { affectedRows: queries.length }
            } else {
                resultado = await conexion.query(query, parametros ?? [])
                resultado = resultado[0] ?? []
            }

            conexion.commit()
        } catch (e) {
            console.log(e)
            error = e
            mensaje = "Error al ejecutar la consulta."
        } finally {
            if (conexion) {
                if (error) conexion.rollback()
                conexion.release()
            }
        }

        return this.respuesta(error === null, mensaje, resultado, error)
    }

    async get(qry) {
        let conexion = null
        let mensaje = "Consulta ejecutada correctamente."
        let error = null
        let resultado = null

        try {
            conexion = await this.db.getConnection()
            resultado = await this.get(qry)
        } catch (error) {
            error = e
            mensaje = "Error al ejecutar la consulta."
        } finally {
            if (conexion) conexion.release()
        }

        return this.respuesta(error === null, mensaje, { resultado }, error)
    }
}
