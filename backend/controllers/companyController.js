// controllers/companyController.js
import CompanyList from '../models/CompanyList.js';

export const addCompany = async (req, res) => {
  const { name, email, phone, address, country, city, postcode } = req.body;

  try {
    // Check if the company already exists by email
    const existingCompany = await CompanyList.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company already exists.' });
    }

    // Create a new company
    const newCompany = new CompanyList({
      name,
      email,
      phone,
      address,
      country,
      city,
      postcode,
    });

    await newCompany.save();

    res.status(201).json({ message: 'Company successfully added!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getCompanies = async (req, res) => {
    try {
      // Fetch all companies
      const companies = await CompanyList.find({}, 'name email phone'); // Retrieve only name, email, and phone
      res.status(200).json(companies);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch companies.' });
    }
  };

  export const deleteCompany = async (req, res) => {
    const companyId = req.params.id;
  
    try {
      // Attempt to find and delete the company by ID
      const company = await CompanyList.findByIdAndDelete(companyId);
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }
  
      res.status(200).json({ message: 'Company deleted successfully' });
    } catch (error) {
      console.error('Error deleting company:', error);
      res.status(500).json({ message: 'Error deleting company', error });
    }
  };

  export const updateCompany = async (req, res) => {
    const { companyId } = req.params;
    const { name, email, phone, address, city, postcode } = req.body;
  
    try {
      const updatedCompany = await CompanyList.findByIdAndUpdate(
        companyId,
        { name, email, phone, address, city, postcode },
        { new: true }  // Return the updated company document
      );
  
      if (!updatedCompany) {
        return res.status(404).json({ message: 'Company not found' });
      }
  
      res.status(200).json(updatedCompany);
    } catch (error) {
      console.error('Error updating company:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };