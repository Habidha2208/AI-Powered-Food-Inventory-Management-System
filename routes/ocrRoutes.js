const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { scanExpiryDate } = require("../controllers/ocrController");

// Upload image and scan expiry date
router.post("/scan", upload.single("image"), scanExpiryDate);

module.exports = router;