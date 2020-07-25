const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");

// GET ALL
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET ONE
router.get("/:id", getProduct, (req, res) => {
  res.send(res.product);
});

//POST ONE
router.post("/", getProduct, async (req, res) => {
  await findCategory(req);
  const product = new Product({
    name: req.body.name,
    category: req.body.category,
    purchasePrice: req.body.purchasePrice,
    sellPrice: req.body.sellPrice,
  });

  try {
    const newProduct = await product.save();
    res.status(200).json(newProduct);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// UPDATE ONE
router.patch("/:id", getProduct, async (req, res) => {
  if (req.body.name && req.body.name !== "") {
    res.product.name = req.body.name;
  }
  if (req.body.category && req.body.category !== "") {
    await findCategory(req);
    res.product.category = req.body.category;
  }
  if (req.body.purchasePrice) {
    res.product.purchasePrice = req.body.purchasePrice;
  }
  if (req.body.sellPrice) {
    res.product.sellPrice = req.body.sellPrice;
  }
  try {
    const updatedProduct = await res.product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// DELETE ONE
router.delete("/:id", getProduct, async (req, res) => {
  try {
    await res.product.remove();
    res.status(200).json({
      message: "Продукт удален!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// FIXME: FIX Duplicate names in PATCH

async function getProduct(req, res, next) {
  let product;
  try {
    if (req.method === "POST" || (req.method === "PATCH" && req.body.name)) {
      product = await Product.find({ name: req.body.name });
      if (product.length) {
        return res.status(409).json({
          message: "Такой продукт уже существует!",
        });
      }
    } else {
      product = await Product.findById(req.params.id);
    }
    if (!product) {
      return res.status(404).json({
        message: "Не могу найти продукт!",
      });
    }
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
  res.product = product;
  next();
}

function findCategory(req) {
  Category.find({ name: req.body.category }, async (error, category) => {
    if (!category.length) {
      const newCategory = new Category({
        name: req.body.category,
      });
      await newCategory.save();
    }
    if (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });
}

module.exports = router;
