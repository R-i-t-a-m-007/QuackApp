import express from 'express';
import { addCompany, getCompanies, deleteCompany, updateCompany } from '../controllers/companyController.js';

const router = express.Router();

// Route to add a company
router.post('/add', addCompany);

// Route to fetch the company list
router.get('/list', getCompanies);

router.delete('/:id', deleteCompany);

router.put('/:companyId', updateCompany);



export default router;
