import { Modelo } from "./modelo.js"
import crypto from "node:crypto"

const qryLogin = "SELECT * FROM usuario WHERE usuario = ? AND cast(aes_decrypt(credenciales, 'PASS_KNT') AS char) = ?"
const qrySesion = "INSERT INTO sesion (id_usuario, token) VALUES (?, ?)"
const qryLoginFallido = "INSERT INTO intento_acceso (usuario, pass, ip, host) VALUES (?, ?, ?, ?)"

export class LoginModel extends Modelo {
    constructor(db) { super(db) }

    async login(datos) {
        if (!datos) return this.sinDatos("La función login de la clase LoginModel no recibió datos.")

        this.mensaje = "Sesión iniciada."

        try {
            this.conexion = await this.db.getConnection()
            await this.conexion.beginTransaction()
            const [resultado] = await this.conexion.query(qryLogin, [datos.user, datos.pass])
            if (resultado.length == 0) return await this.loginFallido(datos)

            this.token = crypto.randomUUID()
            const usuario = resultado[0].id
            const [resultadoSesion] = await this.conexion.query(qrySesion, [usuario, this.token])

            if (resultadoSesion.affectedRows == 0) {
                this.token = null
                throw new Error("No se creo la sesión.")
            }
            await this.conexion.commit()
        } catch (e) {
            await this.conexion.rollback()
            this.error = e
            this.mensaje = "Error al autenticar al usuario."
        } finally {
            this.conexion.release()
        }

        return this.responde({ mensaje: this.mensaje, token: this.token }, this.error)
    }

    async loginFallido(datos) {
        if (!datos) return this.sinDatos("La función loginFallido de la clase LoginModel no recibió datos.")

        this.mensaje = "Credenciales incorrectas."

        try {
            this.conexion = await this.db.getConnection()
            await this.conexion.beginTransaction()
            const [resultado] = await this.conexion.query(qryLoginFallido, [datos.user, datos.pass, datos.ip, datos.host])
            if (resultado.length == 0) throw new Error({ error: "No se inserto el intento de acceso.", datos })
            await this.conexion.commit()
            this.error = { mensaje: "Intento de acceso fallido." }
        } catch (e) {
            if (this.conexion) this.conexion.rollback()
            this.error = e
        } finally {
            if (this.conexion) this.conexion.release()
        }

        return this.responde({ mensaje: this.mensaje }, this.error)
    }
}