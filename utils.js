import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

/**
* @param {string} path - Ruta de un archivo JSON
* @returns {object} Objeto JSON
*/
export const readJSON = (path) => require(path)

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