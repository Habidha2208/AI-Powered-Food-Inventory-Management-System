const Tesseract = require("tesseract.js");

const scanExpiryDate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload an image",
      });
    }

    const result = await Tesseract.recognize(
      req.file.path,
      "eng"
    );

    const text = result.data.text;

    console.log("OCR TEXT:\n", text);

    // Find all dates
    const dates =
      text.match(/\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b/g) || [];

    if (dates.length > 0) {
      // Usually the last date is the expiry/use-by date
      const expiryDate = dates[dates.length - 1];

      return res.json({
        expiryDate,
        text,
      });
    }

    return res.json({
      expiryDate: "",
      text,
      message: "Expiry date not found",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "OCR Failed",
    });
  }
};

module.exports = {
  scanExpiryDate,
};