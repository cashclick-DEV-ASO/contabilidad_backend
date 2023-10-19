import cors from "cors"

export const corsRules = ({ accepted = (process.env.ORIGINS || "*") } = {}) => cors({
	origin: (origin, callback) => {
		if (accepted.split(",").includes(origin)) {
			return callback(null, true)
		}

		if (!origin) {
			return callback(null, true)
		}

		return callback(new Error("Not allowed by CORS"))
	}
})
