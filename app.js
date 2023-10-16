import express, { json } from "express"
import { corsRules } from "./middlewares/cors.js"
import "dotenv/config"

import { createMovieRouter } from "./routes/movies.js"
import { MovieModel as movieModel } from "./models/local-file-system/movie.js"
// import { MovieModel } from "./models/mysql/movie.js"

const createApp = () => {
	const app = express()
	app.use(json())
	app.use(corsRules())
	app.disable("x-powered-by")

	app.use("/movies", createMovieRouter({ movieModel }))

	const PORT = process.env.PORT ?? 0

	app.listen(PORT, () => {
		console.log(`Server ready on: http://localhost:${PORT}`)
	})
}

createApp()