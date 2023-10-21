import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

/**
* @param {string} path - Ruta de un archivo JSON
* @returns {object} Objeto JSON
*/
export const readJSON = (path) => require(path)

/**
 * @param {string} fecha - Fecha en formato ISO
 * @returns {string} Fecha con un formato amigable con MySQL
 * @description Convierte una fecha en formato ISO a un formato amigable con MySQL
 * @example fechaMySQL("25/10/2021") // "2021-10-25 00:00:00"
 */
export const fechaMySQL = fecha => {
    const fechaISO = new Date(fecha).toISOString()
    return fechaISO.slice(0, 10) + " " + fechaISO.slice(11, 19)
}

/**
 * @param {object} informacion - Información que se enviará como respuesta
 * @param {object} error - Error que se mostrara en consola
 * @returns {object} Objeto JSON para enviar como respuesta
*/
export const responde = (informacion, error = undefined) => {
    const resultado = {}
    resultado.success = true
    resultado.informacion = informacion
    if (error) {
        resultado.success = false
        console.log(error)
    }
    return resultado
}