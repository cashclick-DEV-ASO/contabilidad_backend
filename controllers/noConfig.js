export class NoConfigController {
	constructor(modelo) {
		this.modelo = modelo
	}

	postQuery = async (req, res) => {
		const resultado = await this.modelo.post(req.body)
		if (resultado.success) return res.status(200).json(resultado)

		return res.status(500).json(resultado)
	}

	getQuery = async (req, res) => {
		const resultado = await this.modelo.get(req.body)
		if (resultado.success) return res.status(200).json(resultado)

		return res.status(500).json(resultado)
	}
}
