import mongoose from 'mongoose'
import Data from '../model/data.model.js'

export const createData = async (req, res, next) => {
	try {
		if (req.body === undefined) {
			return res.status(400).json({ error: 'A JSON request body is required' })
		}
		const record = await Data.create({ payload: req.body })
		res.status(201).json(record)
	} catch (error) {
		next(error)
	}
}

export const getData = async (req, res, next) => {
	try {
		const records = await Data.find().sort({ createdAt: -1 })
		res.json(records)
	} catch (error) {
		next(error)
	}
}

export const getDataById = async (req, res, next) => {
	try {
		if (!mongoose.isValidObjectId(req.params.id)) {
			return res.status(400).json({ error: 'Invalid data ID' })
		}
		const record = await Data.findById(req.params.id)
		if (!record) return res.status(404).json({ error: 'Data not found' })
		res.json(record)
	} catch (error) {
		next(error)
	}
}

export const updateData = async (req, res, next) => {
	try {
		if (!mongoose.isValidObjectId(req.params.id)) {
			return res.status(400).json({ error: 'Invalid data ID' })
		}
		if (req.body === undefined) {
			return res.status(400).json({ error: 'A JSON request body is required' })
		}
		const record = await Data.findByIdAndUpdate(
			req.params.id,
			{ payload: req.body },
			{ new: true, runValidators: true }
		)
		if (!record) return res.status(404).json({ error: 'Data not found' })
		res.json(record)
	} catch (error) {
		next(error)
	}
}

export const deleteData = async (req, res, next) => {
	try {
		if (!mongoose.isValidObjectId(req.params.id)) {
			return res.status(400).json({ error: 'Invalid data ID' })
		}
		const record = await Data.findByIdAndDelete(req.params.id)
		if (!record) return res.status(404).json({ error: 'Data not found' })
		res.json({ message: 'Data deleted', id: record.id })
	} catch (error) {
		next(error)
	}
}
