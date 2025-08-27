// server.js (minimal test version)
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Basic middleware
app.use(express.json());

// Simple health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Test route without parameters
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route working!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;