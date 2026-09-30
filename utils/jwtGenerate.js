import jwt from 'jsonwebtoken'

const revokedTokens = new Map()

const getSecret = () => {
	if (process.env.JWT_SECRET) return process.env.JWT_SECRET
	if (process.env.NODE_ENV !== 'production') return 'development-only-change-me'
	throw new Error('JWT_SECRET must be set in production')
}

export const generateToken = (userId) => jwt.sign(
	{ sub: userId },
	getSecret(),
	{ expiresIn: '1d' }
)

export const verifyToken = (token) => jwt.verify(token, getSecret())

export const revokeToken = (token) => {
	const { exp } = jwt.decode(token) || {}
	if (exp) revokedTokens.set(token, exp * 1000)
}

export const isTokenRevoked = (token) => {
	const expiresAt = revokedTokens.get(token)
	if (!expiresAt) return false
	if (expiresAt <= Date.now()) {
		revokedTokens.delete(token)
		return false
	}
	return true
}
