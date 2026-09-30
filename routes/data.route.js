import { Router } from 'express'
import { createData, deleteData, getData, getDataById, updateData } from '../controllers/data.controller.js'

const router = Router()

router.route('/').post(createData).get(getData)
router.route('/:id').get(getDataById).put(updateData).delete(deleteData)

export default router
