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

const ItemSchema = new mongoose.Schema({
  itemName: String,
  sku: String,
  quantity: Number,
  shippingStatus: String
});
const InventoryItem = mongoose.model('InventoryItem', ItemSchema);

app.post('/api/inventory', async (req, res) => {
  try {
    const newItem = new InventoryItem(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  }
  catch (err) { res.status(400).json({ error: err.message })}
});

app.put('/api/inventory/:id', async (req, res) => {
  try{
    const updatedItem = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  }
  catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/inventory/:id', async (req, res) => {
  try{
    await InventoryItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted from records' });
  }
  catch (err) { res.status(400).json({ error: err.message }); }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})