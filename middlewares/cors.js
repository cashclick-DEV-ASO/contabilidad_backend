import cors from "cors"

export const configuracionCORS = (aceptados = process.env.ORIGINS || "*") => cors({
	origin: (origin, callback) => {
		if (aceptados.split(",").includes(origin))
			return callback(null, true)

		if (!origin)
			return callback(null, true)

		return callback("Not allowed by CORS")
	}
})