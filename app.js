const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
console.log("OPENROUTER:", process.env.OPENROUTER_API_KEY);
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const foodRoutes = require("./routes/foodRoutes");
const aiRoutes = require("./routes/aiRoutes");
const ocrRoutes = require("./routes/ocrRoutes");
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("🚀 Smart Pantry Backend Running");
});

const PORT = process.env.PORT || 5000;
app.use("/api/users", userRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/ocr", ocrRoutes);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});