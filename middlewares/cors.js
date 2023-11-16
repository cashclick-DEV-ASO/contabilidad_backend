import cors from "cors"

export const configuracionCORS = (aceptados = process.env.ORIGINS) => cors({
	origin: (origin, callback) => {
		if (!origin || aceptados === "*") return callback(null, true)

		const gandalf = aceptados
			.split(",")
			.some(aceptado => origin.startsWith(aceptado))
		if (gandalf) return callback(null, true)

		return callback("Not allowed by CORS")
	},
	methods: "GET,PUT,PATCH,POST",
	credentials: true,
})
