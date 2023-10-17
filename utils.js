import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

export const readJSON = (path) => require(path)

export const manejoError = (informeInterno, informeExterno = {}, informacion = {}) => {
    console.log(informeInterno)
    const resultado = {}
    resultado.success = false
    resultado.error = informeExterno
    resultado.informacion = informacion
    return resultado
}

export const manejoExito = ({ informacion = {} }) => {
    const resultado = {}
    resultado.success = true
    resultado.error = null
    resultado.informacion = informacion
    return resultado
}