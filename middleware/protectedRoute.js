import { isTokenRevoked, verifyToken } from '../utils/jwtGenerate.js'

const protectedRoute = (req, res, next) => {
	const authorization = req.get('authorization')
	const [scheme, token] = authorization?.split(' ') || []

	if (scheme !== 'Bearer' || !token) {
		return res.status(401).json({ error: 'A bearer token is required' })
	}

	try {
		if (isTokenRevoked(token)) {
			return res.status(401).json({ error: 'Token has been logged out' })
		}
		const decoded = verifyToken(token)
		req.userId = decoded.sub
		req.authToken = token
		next()
	} catch {
		res.status(401).json({ error: 'Invalid or expired token' })
	}
}

export default protectedRoute
