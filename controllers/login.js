import { validaLogin } from "../schemas/login.js"

export class LoginController {
    constructor(modelo) {
        this.modelo = modelo
    }

    login = async (req, res) => {
        const datos = req.body
        datos.ip = req.ip
        datos.host = req.hostname

        const validacion = validaLogin(datos)
        if (validacion.error) {
            const intento = await this.modelo.loginFallido(datos, { error: JSON.parse(validacion.error.message) })
            return res.status(400)
                .json(intento)
        }
        
        const resultado = await this.modelo.login(validacion.data)
        if (resultado.success) return res.status(200).json(resultado)

        return res.status(resultado.informacion?.mensaje == "Credeciales incorrectas." ? 400 : 500).json(resultado)
    }

    logout = async (req, res) => {
        const token = req.headers["token"]
        const resultado = await this.modelo.logout(token)
        if (resultado.success) return res.status(200).json(resultado)

        return res.status(500).json(resultado)
    }
}