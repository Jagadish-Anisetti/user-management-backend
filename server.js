const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

mongoose.connect('mongodb+srv://jagadeshanisetti:jagadish1234@jagadish.9pknj.mongodb.net/?retryWrites=true&w=majority&appName=Jagadish', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Add user
app.post('/api/users', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json({ message: 'User added' });
});

// Get users with filter, search, pagination
app.get('/api/users', async (req, res) => {
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
  res.json({ users, totalPages: Math.ceil(count / limit) });
});

app.listen(5000, () => console.log('Server started on port 5000'));
