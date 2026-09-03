const Food = require("../models/Food");

// ===============================
// Add Food
// ===============================
const addFood = async (req, res) => {
  try {
    const { name, quantity, category, expiryDate } = req.body;

    // Quantity validation
    if (
      !quantity ||
      Number(quantity) < 1 ||
      !Number.isInteger(Number(quantity))
    ) {
      return res.status(400).json({
        message:
          "Quantity must be a whole number greater than or equal to 1",
      });
    }

    const food = await Food.create({
      user: req.user.id,
      name,
      quantity: Number(quantity),
      category,
      expiryDate,
    });

    res.status(201).json({
      message: "Food Added Successfully",
      food,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ===============================
// Get All Foods
// ===============================
const getFoods = async (req, res) => {
  try {
    const foods = await Food.find({
      user: req.user.id,
    });

    res.status(200).json(foods);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ===============================
// Update Food
// ===============================
const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, category, expiryDate } = req.body;

    // Quantity validation
    if (
      !quantity ||
      Number(quantity) < 1 ||
      !Number.isInteger(Number(quantity))
    ) {
      return res.status(400).json({
        message:
          "Quantity must be a whole number greater than or equal to 1",
      });
    }

    const updatedFood = await Food.findOneAndUpdate(
      {
        _id: id,
        user: req.user.id,
      },
      {
        name,
        quantity: Number(quantity),
        category,
        expiryDate,
      },
      {
        new: true,
      }
    );

    if (!updatedFood) {
      return res.status(404).json({
        message: "Food item not found",
      });
    }

    res.json({
      message: "Food Updated Successfully",
      updatedFood,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ===============================
// Delete Food
// ===============================
const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFood = await Food.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!deletedFood) {
      return res.status(404).json({
        message: "Food item not found",
      });
    }

    res.json({
      message: "Food Deleted Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ===============================
// Export
// ===============================
module.exports = {
  addFood,
  getFoods,
  updateFood,
  deleteFood,
};