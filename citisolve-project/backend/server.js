const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// -----------------------------
// CORS CONFIG
// -----------------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://citisolve-fullstack-project-1.onrender.com"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// -----------------------------
// MIDDLEWARE
// -----------------------------
app.use(express.json());

// -----------------------------
// MONGODB CONNECTION
// -----------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });

// -----------------------------
// ROUTES
// -----------------------------
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

// -----------------------------
// TEST ROUTE
// -----------------------------
app.get("/", (req, res) => {
  res.send("CitiSolve Backend Server is Running...");
});

// -----------------------------
// 404 HANDLER
// -----------------------------
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

// -----------------------------
// ERROR HANDLER
// -----------------------------
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// -----------------------------
// SERVER START
// -----------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
