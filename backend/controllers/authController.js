import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Company from '../models/Company.js';
import Individual from '../models/Individual.js';

export const registerUser = async (req, res) => {
  const { username, email, phone, address, postcode, password, userType } = req.body;

  try {
    // Check for existing user
    const existingUsername =
      (await Company.findOne({ username })) || (await Individual.findOne({ username }));
    if (existingUsername) return res.status(400).json({ message: 'Username already exists.' });

    const existingEmail =
      (await Company.findOne({ email })) || (await Individual.findOne({ email }));
    if (existingEmail) return res.status(400).json({ message: 'Email already exists.' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Determine the user type
    if (userType === 'company') {
      const newCompany = new Company({
        username,
        email,
        phone,
        address,
        postcode,
        password: hashedPassword,
      });
      await newCompany.save();
    } else if (userType === 'individual') {
      const newIndividual = new Individual({
        username,
        email,
        phone,
        address,
        postcode,
        password: hashedPassword,
      });
      await newIndividual.save();
    } else {
      return res.status(400).json({ message: 'Invalid user type.' });
    }

    res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const loginUser = async (req, res) => {
  const { username, password, userType } = req.body;

  try {
    let user;
    if (userType === 'company') {
      user = await Company.findOne({ username });
    } else if (userType === 'individual') {
      user = await Individual.findOne({ username });
    } else {
      return res.status(400).json({ message: 'Invalid user type.' });
    }

    if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    const payload = { id: user._id, username: user.username, userType };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};
