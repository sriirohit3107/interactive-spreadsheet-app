// BACKEND - server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/interactive_spreadsheet', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB - interactive_spreadsheet'));

// Schema and Model
const cellSchema = new mongoose.Schema({
  row: Number,
  col: Number,
  value: String,
});

const Cell = mongoose.model('Cell', cellSchema);

// Routes
// Get all cells
app.get('/cells', async (req, res) => {
  try {
    const cells = await Cell.find();
    res.json(cells);
  } catch (error) {
    console.error('Error fetching cells:', error);
    res.status(500).send('Server Error');
  }
});

// Update or create a cell
app.post('/cells', async (req, res) => {
  const { row, col, value } = req.body;
  console.log('Received data:', { row, col, value }); // Log data from frontend

  try {
    if (value === "") {
      // If value is an empty string, delete the cell from the database
      await Cell.deleteOne({ row, col });
      console.log('Cell deleted:', { row, col });
      return res.json({ row, col, value: "" });  // Send empty value as response
    }

    // Otherwise, update or create the cell
    const cell = await Cell.findOneAndUpdate(
      { row, col },   // Search by row and column
      { value },      // Update value
      { new: true, upsert: true }  // Create if not found
    );
    console.log('Cell saved/updated:', cell);  // Log saved/updated cell
    res.json(cell);
  } catch (error) {
    console.error('Error saving cell:', error);  // Log any errors
    res.status(500).send('Server Error');
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
