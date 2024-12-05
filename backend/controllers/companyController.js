import CompanyList from '../models/CompanyList.js';

export const addCompany = async (req, res) => {
  const { name, email, phone, address, country, city, postcode } = req.body;
  const userId = req.session.user.id; // Get the user ID from the session

  try {
    // Check if the user already has a company with the same email
    const existingCompany = await CompanyList.findOne({ email, user: userId });
    if (existingCompany) return res.status(400).json({ message: 'Company already exists.' });

    // Create a new company and associate it with the logged-in user
    const newCompany = new CompanyList({ 
      name, 
      email, 
      phone, 
      address, 
      country, 
      city, 
      postcode,
      user: userId // Set the user reference
    });

    await newCompany.save();
    res.status(201).json({ message: 'Company added successfully!', company: newCompany });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};


export const getCompanies = async (req, res) => {
  const userId = req.session.user.id; // Get the user ID from the session

  try {
    // Fetch companies associated with the logged-in user
    const companies = await CompanyList.find({ user: userId }, 'name email phone');
    res.status(200).json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch companies.' });
  }
};


export const updateCompany = async (req, res) => {
  const { companyId } = req.params;
  const { name, email, phone, address, city, postcode } = req.body;
  const userId = req.session.user.id; // Get the user ID from the session

  try {
    const updatedCompany = await CompanyList.findOneAndUpdate(
      { _id: companyId, user: userId }, // Ensure the company belongs to the logged-in user
      { name, email, phone, address, city, postcode },
      { new: true }
    );

    if (!updatedCompany) return res.status(404).json({ message: 'Company not found or you do not have permission to update it.' });

    res.status(200).json(updatedCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};


export const deleteCompany = async (req, res) => {
  const companyId = req.params.id;
  const userId = req.session.user.id; // Get the user ID from the session

  try {
    const company = await CompanyList.findOneAndDelete({ _id: companyId, user: userId }); // Check if company belongs to the user
    if (!company) return res.status(404).json({ message: 'Company not found or you do not have permission to delete it.' });

    res.status(200).json({ message: 'Company deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};
