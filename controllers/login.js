import { validaLogin } from "../schemas/login.js"

export class LoginController {
    constructor(modelo) {
        this.modelo = modelo
    }

    login = async (req, res) => {
        const token = req.body.gToken
        const captcha = await this.modelo.validaCaptcha(token)
        if (!captcha)
            return res.status(500).json({ success: false, mensaje: "Error al validar el captcha." })

        if (captcha.errores) return res.status(400).json(captcha)

        const datos = req.body
        datos.ip = req.ip
        datos.host = req.hostname

        const validacion = validaLogin(datos)
        if (validacion.error) {
            const intento = await this.modelo.errorFormato()
            return res.status(400).json(intento)
        }

        const resultado = await this.modelo.login(validacion.data)
        if (resultado.success) {
            return res
                .cookie("TOKEN", resultado.datos[0].token, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 30,
                    sameSite: "None",
                    secure: true
                })
                .cookie("PERFIL", resultado.datos[0].perfil, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 30,
                    sameSite: "None",
                    secure: true
                })
                .status(200)
                .json(resultado)
        }

        return res
            .status(resultado.informacion?.mensaje == "Credenciales incorrectas." ? 400 : 500)
            .json(resultado)
    }

    logout = async (req, res) => {
        const token = req.headers["token"] ?? req.cookies.TOKEN ?? ""
        const resultado = await this.modelo.logout(token)
        if (resultado.success) return res.status(200).json(resultado)

        return res.status(500).json(resultado)
    }
}
