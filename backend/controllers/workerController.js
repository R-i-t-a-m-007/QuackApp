import Worker from '../models/Worker.js';

export const addWorker = async (req, res) => {
  const { name, email, phone, role, department, address, joiningDate } = req.body;
  const userId = req.session.user.id; // Get the user ID from the session

  try {
    // Check if the user already has a worker with the same email
    const existingWorker = await Worker.findOne({ email, user: userId });
    if (existingWorker) return res.status(400).json({ message: 'Worker already exists.' });

    // Create a new worker and associate it with the logged-in individual user
    const newWorker = new Worker({
      name,
      email,
      phone,
      role,
      department,
      address,
      joiningDate,
      user: userId, // Set the user reference
    });

    await newWorker.save();
    res.status(201).json({ message: 'Worker added successfully!', worker: newWorker });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getWorkers = async (req, res) => {
    const userId = req.session.user.id; // Get the user ID from the session
  
    try {
      // Fetch workers associated with the logged-in individual user
      const workers = await Worker.find({ user: userId }, 'name email phone role department joiningDate');
      res.status(200).json(workers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch workers.' });
    }
  };
  

  export const updateWorker = async (req, res) => {
    const { workerId } = req.params;
    const { name, email, phone, role, department, address, joiningDate } = req.body;
    const userId = req.session.user.id; // Get the user ID from the session
  
    try {
      const updatedWorker = await Worker.findOneAndUpdate(
        { _id: workerId, user: userId }, // Ensure the worker belongs to the logged-in individual user
        { name, email, phone, role, department, address, joiningDate },
        { new: true }
      );
  
      if (!updatedWorker)
        return res.status(404).json({ message: 'Worker not found or you do not have permission to update it.' });
  
      res.status(200).json(updatedWorker);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  };
  

  export const deleteWorker = async (req, res) => {
    const workerId = req.params.id;
    const userId = req.session.user.id; // Get the user ID from the session
  
    try {
      const worker = await Worker.findOneAndDelete({ _id: workerId, user: userId }); // Check if worker belongs to the user
      if (!worker) return res.status(404).json({ message: 'Worker not found or you do not have permission to delete it.' });
  
      res.status(200).json({ message: 'Worker deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  };
  