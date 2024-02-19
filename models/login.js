import { Modelo } from "./modelo.js"
import crypto from "node:crypto"
import mapaJSON from "../schemas/mapaNavegacion.js"

const qryLogin = `SELECT * FROM usuario WHERE usuario = ? AND cast(aes_decrypt(password, '${process.env.DB_SECRET_KEY_PASS}') AS char) = ?`
const qrySesion = "INSERT INTO sesion (id_usuario, token) VALUES (?, ?)"
const qryMapa =
    "SELECT m.* FROM mapa_navegacion_frontend m WHERE m.id IN (SELECT pf.id_mapa FROM permiso_frontend pf WHERE pf.id_perfil = ?) OR m.permanente = 1 ORDER BY padre, orden;"

export class LoginModel extends Modelo {
    constructor(db) {
        super(db)
    }

    async errorFormato() {
        return this.respuesta(
            false,
            "Error en formato de los datos enviados.",
            "Credenciales incorrectas"
        )
    }

    async login(datos) {
        if (!datos) return console.log("La función login de la clase LoginModel no recibió datos.")

        let mensaje = "Sesión iniciada."
        let success = true
        let error = null
        let token = null
        let nombre = null
        let mapaFront = null
        let conexion = null

        try {
            conexion = await this.db.getConnection()
            await conexion.beginTransaction()

            const [resultado] = await conexion.query(qryLogin, [datos.user, datos.pass])
            if (resultado.length == 0) throw new Error("Credenciales incorrectas.")

            token = crypto.randomUUID()
            nombre = resultado[0].nombre
            const usuario = resultado[0].id
            const [resultadoSesion] = await conexion.query(qrySesion, [usuario, token])

            if (resultadoSesion.affectedRows == 0) {
                token = null
                throw new Error("No se logro registrar la sesión.")
            }

            mapaFront = JSON.stringify(mapaJSON)

            await conexion.commit()
        } catch (e) {
            if (conexion) await conexion.rollback()
            success = false
            error = e.message
            mensaje = "Error al autenticar al usuario."
        } finally {
            if (conexion) conexion.release()
        }

        return this.respuesta(
            success,
            mensaje,
            !token
                ? null
                : {
                      token,
                      nombre,
                      mapa: mapaFront
                  },
            error
        )
    }

    construirMapa(registros, padre = "") {
        const resultado = {}

        registros.forEach((registro) => {
            const padreR = registro.padre ?? ""
            if (this.compararTextos(padreR, padre)) {
                resultado[registro.grupo] = {
                    titulo: registro.titulo,
                    vista: registro.vista ?? this.construirMapa(registros, registro.grupo)
                }
            }
        })
        return resultado
    }

    compararTextos(texto1, texto2) {
        if (texto1 == null || texto2 == null) return texto1 == texto2

        const normalizar = (texto) =>
            texto
                .toLowerCase()
                .normalize("NFD")
                .replace(" ", "")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/_/g, "")
                .replace(/ /g, "")
        console.log(texto1, texto2, normalizar(texto1), normalizar(texto2))
        return normalizar(texto1) === normalizar(texto2)
    }
}
