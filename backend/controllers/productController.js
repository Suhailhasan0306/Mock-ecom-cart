import Product from "../models/Product.js";

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      // Seed default products if empty
      const defaultData = [
        { name: "T-shirt", price: 500 },
        { name: "Shoes", price: 1200 },
        { name: "Jeans", price: 900 },
        { name: "Cap", price: 300 },
        { name: "Watch", price: 1500 },
      ];
      await Product.insertMany(defaultData);
      return res.json(await Product.find());
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
