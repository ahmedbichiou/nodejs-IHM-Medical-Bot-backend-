const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Capsule = require('./models/Capsule');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // This will allow all origins
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.get('/api/capsules', async (req, res) => {
  try {
    const capsules = await Capsule.find();
    res.json(capsules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get capsule by ID
app.get('/api/capsules/:id', async (req, res) => {
  const { id } = req.params; // Get the capsule ID from the URL parameters
  try {
    const capsule = await Capsule.findOne({ id }); // Find the capsule by its ID
    if (!capsule) {
      return res.status(404).json({ message: 'Capsule not found' }); // Return 404 if not found
    }
    res.json(capsule); // Return the found capsule
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle any errors
  }
});

// Update or Create a capsule
app.post('/api/capsules', async (req, res) => {
  const { id } = req.body; // Get the id from the request body
  try {
    const existingCapsule = await Capsule.findOne({ id }); // Check if the capsule already exists

    if (existingCapsule) {
      // If it exists, update the existing capsule
      Object.assign(existingCapsule, req.body); // Update the existing capsule with new data
      const updatedCapsule = await existingCapsule.save(); // Save the updated capsule
      res.status(200).json(updatedCapsule); // Return the updated capsule
    } else {
      // If it doesn't exist, create a new one
      const capsule = new Capsule(req.body);
      const savedCapsule = await capsule.save();
      res.status(201).json(savedCapsule);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
