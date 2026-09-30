import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true, trim: true, lowercase: true },
		passwordHash: { type: String, required: true, select: false }
	},
	{ timestamps: true }
)

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User
