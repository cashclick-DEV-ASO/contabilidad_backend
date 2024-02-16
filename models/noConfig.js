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
            const { query, parametros } = datos
            resultado = await conexion.query(query, parametros ?? [])
            resultado = resultado[0] ?? []
        } catch (e) {
            console.log(e)
            error = e
            mensaje = "Error al ejecutar la consulta."
        } finally {
            if (conexion) conexion.release()
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
