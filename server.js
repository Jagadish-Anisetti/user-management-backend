const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./db');
const User = require('./models/User');

const app = express();

// ✅ Enable CORS for Netlify frontend
app.use(cors({
  origin: 'https://user-management-jagadish.netlify.app/' // Replace with your actual Netlify URL
}));

app.use(express.json());

// ✅ Connect to MongoDB using external db.js
connectDB();

// ✅ Routes

// Add a new user
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ message: 'User added' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// Get users with search, filter, and pagination
app.get('/api/users', async (req, res) => {
  try {
    const { page = 1, search = '', status } = req.query;

    const query = {
      name: { $regex: search, $options: 'i' },
      ...(status ? { status } : {})
    };

    const limit = 10;
    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await User.countDocuments(query);
    const totalPages = Math.ceil(count / limit);

    res.json({ users, totalPages });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
