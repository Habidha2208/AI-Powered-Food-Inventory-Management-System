const express = require("express");
const router = express.Router();

const { suggestRecipe } = require("../controllers/aiController");

router.post("/recipe", suggestRecipe);

module.exports = router;