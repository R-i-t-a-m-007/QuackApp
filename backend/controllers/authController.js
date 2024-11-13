import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
  const { username, email, password, phone, address, postcode, userType } = req.body;
  
  // Validate all fields are present
  if (!username || !email || !password || !phone || !address || !postcode || !userType) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Validate userType
  if (!['company', 'individual'].includes(userType)) {
    return res.status(400).json({ message: 'Invalid user type.' });
  }

  try {
    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: 'Email already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ 
      username, 
      email, 
      password: hashedPassword, 
      phone, 
      address, 
      postcode,
      userType
    });

    // Save the user
    await user.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Exclude password from the token payload
    const tokenPayload = {
      userId: user._id,
      username: user.username,
      userType: user.userType
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ 
      token, 
      user: {
        id: user._id,
        username: user.username,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Optional: Add a username check endpoint
export const checkUsernameAvailability = async (req, res) => {
  const { username } = req.query;

  try {
    const existingUser = await User.findOne({ username });
    res.json({ exists: !!existingUser });
  } catch (error) {
    console.error('Username check error:', error);
    res.status(500).json({ message: 'Server error', exists: false });
  }
};