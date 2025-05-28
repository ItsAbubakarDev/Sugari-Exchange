const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ Missing MONGO_URI in .env file');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/portfolio",require("./routes/portfolioRoutes"))
app.use("/api/trades",require("./routes/tradeRoutes"))


// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Add your API routes here
// Example: app.use('/api/users', require('./routes/userRoutes'));

app.listen(3001, () => console.log(`Server running on port 3001`));

