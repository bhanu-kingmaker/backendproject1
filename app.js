import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import tasks from "./models/tasks.js";

const app = express();

app.use(bodyParser.json());
app.use(express.json());

// Allow both localhost (React dev) and your Vercel frontend (production)
const allowedOrigins = [
  "http://localhost:3000",
  "https://frontendproject1-alpha.vercel.app",
  "https://frontendproject1-six.vercel.app",
  "https://frontendproject1-rouge.vercel.app" // <--- ADD THIS LINE
];
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// POST data
app.post('/api/addtask', async (req, res) => {
  const { task, status, deadline } = req.body;
  const tas = new tasks({ task, status, deadline });
  try {
    await tas.save();
    return res.status(200).json({ message: "success" });
  } catch (err) {
    return res.status(500).json({ message: "Error saving task." });
  }
});

// GET all tasks
app.get('/api/getTask', async (req, res) => {
  try {
    const tas = await tasks.find();
    if (!tas || tas.length === 0) {
      return res.status(404).json({ message: "No task Found." });
    }
    return res.status(200).json({ tas });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching tasks." });
  }
});

// DELETE task
app.delete('/api/deletetask/:_id', async (req, res) => {
  const id = req.params._id;
  try {
    const task_delete = await tasks.findByIdAndDelete({ _id: id });
    if (!task_delete) {
      return res.status(400).json({ message: "Unable to delete." });
    }
    return res.status(200).json({ message: "Deleted." });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting task." });
  }
});

// GET single task by ID
app.get('/api/get_task_data/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const task_data = await tasks.findById({ _id });
    if (!task_data) {
      return res.status(400).json({ message: "No task Found." });
    }
    return res.status(200).json({ task_data });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching task." });
  }
});

// PUT update task
app.put('/api/edit_task/:id', async (req, res) => {
  const taskid = req.params.id;
  const { task, status, deadline } = req.body;
  try {
    const tsk = await tasks.findByIdAndUpdate(taskid, { task, status, deadline }, { new: true });
    if (!tsk) {
      return res.status(400).json({ message: "Unable to update the task." });
    }
    return res.status(200).json({ tsk });
  } catch (err) {
    return res.status(500).json({ message: "Error updating task." });
  }
});

// MongoDB connection (uses environment variable if present)
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://yerakalabhanupranay2004:Aditya123@cluster0.qw1ss4h.mongodb.net/";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("DB connection error:", err));

// Only listen if NOT running on Vercel (Vercel handles this itself)
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

export default app; // For Vercel