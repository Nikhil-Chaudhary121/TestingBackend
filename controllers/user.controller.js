import { promisify } from 'node:util'
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import User from '../model/user.model.js'
import { generateToken, revokeToken } from '../utils/jwtGenerate.js'

const scrypt = promisify(scryptCallback)

const hashPassword = async (password) => {
	const salt = randomBytes(16).toString('hex')
	const hash = await scrypt(password, salt, 64)
	return `${salt}:${hash.toString('hex')}`
}

const passwordMatches = async (password, storedHash) => {
	const [salt, hash] = storedHash.split(':')
	const expected = Buffer.from(hash, 'hex')
	const actual = await scrypt(password, salt, expected.length)
	return expected.length === actual.length && timingSafeEqual(expected, actual)
}

export const register = async (req, res, next) => {
	try {
		const email = typeof req.body?.email === 'string' ? req.body.email.trim() : ''
		const password = req.body?.password
		if (!email || typeof password !== 'string') {
			return res.status(400).json({ error: 'Email and password are required' })
		}
		if (password.length < 8) {
			return res.status(400).json({ error: 'Password must be at least 8 characters' })
		}

		const user = await User.create({ email, passwordHash: await hashPassword(password) })
		const token = generateToken(user.id)
		res.status(201).json({ user: { id: user.id, email: user.email }, token })
	} catch (error) {
		next(error)
	}
}

export const login = async (req, res, next) => {
	try {
		const email = typeof req.body?.email === 'string' ? req.body.email.trim() : ''
		const password = req.body?.password
		if (!email || typeof password !== 'string') {
			return res.status(400).json({ error: 'Email and password are required' })
		}

		const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash')
		if (!user || !(await passwordMatches(password, user.passwordHash))) {
			return res.status(401).json({ error: 'Invalid email or password' })
		}

		res.json({ user: { id: user.id, email: user.email }, token: generateToken(user.id) })
	} catch (error) {
		next(error)
	}
}

export const logout = (req, res) => {
	revokeToken(req.authToken)
	res.json({ message: 'Logged out' })
}
