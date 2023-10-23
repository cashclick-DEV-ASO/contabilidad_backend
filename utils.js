import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

/**
* @param {string} path - Ruta de un archivo JSON
* @returns {object} Objeto JSON
*/
export const readJSON = (path) => require(path)