import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './db/connectDB.js'
import dataRoutes from './routes/data.route.js'
import userRoutes from './routes/user.route.js'

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
	res.json({ message: 'API is running' })
})

app.use('/api/data', dataRoutes)
app.use('/api/users', userRoutes)

app.use((req, res) => {
	res.status(404).json({ error: 'Route not found' })
})

app.use((err, req, res, next) => {
	if (res.headersSent) return next(err)

	const status = err.code === 11000 ? 409 : err.status || err.statusCode || 500
	const message = err.code === 11000
		? 'A record with that value already exists'
		: status === 500
			? 'Internal server error'
			: err.message

	if (status >= 500) console.error(err)
	res.status(status).json({ error: message })
})

try {
	await connectDB()
	app.listen(port, () => console.log(`API listening on port ${port}`))
} catch (error) {
	console.error(`Unable to start API: ${error.message}`)
	process.exitCode = 1
}
