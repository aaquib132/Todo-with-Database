
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const todoSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false }
});

const Todo = mongoose.model('Todo', todoSchema);

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/todos', async (req, res) => {
  try {
    const todo = new Todo({ text: req.body.text });
    await todo.save();
    res.json(todo);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.patch('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true }
    );
    res.json(todo);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log('🚀 Server running on http://localhost:3006'));

