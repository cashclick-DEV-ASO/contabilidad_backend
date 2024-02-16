export class Modelo {
    constructor(db) {
        this.db = db
    }

    /**
     * Responde a una solicitud con un objeto de respuesta estructurado.
     * @param {boolean} success - Indica si la solicitud fue exitosa o no.
     * @param {string} mensaje - El mensaje de respuesta.
     * @param {any} [datos=null] - Los datos de respuesta opcionales.
     * @param {any} [errores=null] - Los errores de respuesta opcionales.
     * @returns {object} - El objeto de respuesta estructurado.
     */
    respuesta(success, mensaje, datos = null, errores = null, sesionCaducada = null) {
        const res = {}

        res.success = success
        res.mensaje = mensaje

        if (datos !== null) {
            if (Array.isArray(datos)) res.datos = datos
            else res.datos = [datos]
        }

        if (errores !== null) {
            if (Array.isArray(errores)) res.errores = errores
            else res.errores = [errores]
        }

        if (sesionCaducada !== null) res.sesionCaducada = sesionCaducada

        return res
    }

    /**
     * @param {string} fecha - Fecha en formato ISO
     * @returns {string} Fecha con un formato amigable con MySQL
     * @description Convierte una fecha en formato ISO a un formato amigable con MySQL
     * @example fechaMySQL("25/10/2021") // "2021-10-25 00:00:00"
     */
    fechaMySQL(fecha) {
        const fechaISO = new Date(fecha).toISOString()
        return fechaISO.slice(0, 10) + " " + fechaISO.slice(11, 19)
    }
}
