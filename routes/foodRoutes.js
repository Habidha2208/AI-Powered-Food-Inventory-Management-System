const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const {
  addFood,
  getFoods,
  updateFood,
  deleteFood,
} = require("../controllers/foodController");
router.post("/add", authMiddleware, addFood);

router.get("/", authMiddleware, getFoods);

router.put("/:id", authMiddleware, updateFood);

router.delete("/:id", authMiddleware, deleteFood);
module.exports = router;