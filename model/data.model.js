import mongoose from 'mongoose'

const dataSchema = new mongoose.Schema(
	{ payload: { type: mongoose.Schema.Types.Mixed, required: true } },
	{ timestamps: true }
)

const Data = mongoose.models.Data || mongoose.model('Data', dataSchema)

export default Data
