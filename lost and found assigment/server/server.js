const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

// Import Routes
const authRoutes = require("./routes/authRoutes");
const claimRoutes = require("./routes/claimRoutes");
const itemRoutes = require("./routes/itemRoutes");
const moderatorRoutes = require("./routes/moderatorRoutes");


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Test route
app.get("/", (req, res) => {
  res.send("Hello World! Lost & Found API is running");
});

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/moderator", moderatorRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`⚡ Server running on http://localhost:${PORT}`);
});
