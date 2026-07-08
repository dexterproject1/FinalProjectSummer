require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to Warehouse MongoDB Master Database'))
  .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const itemSchema = new mongoose.Schema({
  itemName: String,
  sku: String,
  quantity: Number,
  shippingStatus: String
}, { timestamps: true });

const InventoryItem = mongoose.model('InventoryItem', itemSchema);

app.post('/api/auth/register', async (req, res) => {
  try {
    const checkUser = await User.findOne({ username: req.body.username });
    if (checkUser) {
      return res.status(400).json({ error: 'Username already exists.' });
    }
    const newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } 
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const user = await User.findOne({ 
      username: req.body.username, 
      password: req.body.password 
    });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }
    res.json({ message: 'Login successful', username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/inventory', async (req, res) => {
  try {
    const items = await InventoryItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/inventory', async (req, res) => {
  try {
    const newItem = new InventoryItem(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) { 
    res.status(400).json({ error: err.message }); 
  }
});

app.put('/api/inventory/:id', async (req, res) => {
  try {
    const updatedItem = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) { 
    res.status(400).json({ error: err.message }); 
  }
});

app.delete('/api/inventory/:id', async (req, res) => {
  try {
    await InventoryItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted.' });
  } catch (err) { 
    res.status(400).json({ error: err.message }); 
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});