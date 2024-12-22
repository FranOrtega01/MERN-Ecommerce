import { Router } from 'express'
import { getPaginate, getOneByID, getRealTime } from '../controller/products.view.controller.js';
import { authorization } from '../utils.js';

const router = Router()


// Real time products
router.get('/realTimeProducts', getRealTime)

// Listar products
router.get('/', getPaginate)

router.get('/create', authorization(['premium','admin']), (req,res) => {
    res.render('createProduct')
})

// Get por id
router.get('/:id', getOneByID)


export default router