import express from 'express';
import { addCompany, getCompanies, updateCompany, deleteCompany } from '../controllers/companyController.js';
import { sessionMiddleware } from '../middlewares/sessionMiddleware.js';

const router = express.Router();

router.post('/add', sessionMiddleware, addCompany);
router.get('/list', sessionMiddleware, getCompanies);
router.put('/:companyId', sessionMiddleware, updateCompany);
router.delete('/:id', sessionMiddleware, deleteCompany);

export default router;
