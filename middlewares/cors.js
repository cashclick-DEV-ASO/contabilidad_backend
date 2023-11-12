import cors from "cors"

export const configuracionCORS = (aceptados = process.env.ORIGINS) =>
	cors({
		origin: (origin, callback) => {
			if (!origin || aceptados === "*") return callback(null, true)

			if (
				aceptados
					.split(",")
					.some(aceptado => origin.startsWith(aceptado))
			)
				return callback(null, true)

			return callback("Not allowed by CORS")
		},
	})
