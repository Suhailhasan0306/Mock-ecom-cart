import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";

// GET /api/cart
export const getCart = async (req, res) => {
  const items = await CartItem.find().populate("productId");
  const cart = items.map((item)=>({
    _id: item._id,
    name: item.productId ?
    item.productId.name : "No Name",
    price: item.productId ?
    item.productId.price : 0,
    qty: item.qty,
  }));
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  res.json({ cart, total });
};

// POST /api/cart
export const addToCart = async (req, res) => {
  const { productId, qty } = req.body;
  const existing = await CartItem.findOne({ productId });
  if (existing) {
    existing.qty += qty;
    await existing.save();
  } else {
    await CartItem.create({ productId, qty });
  }
  res.json({ message: "Item added to cart" });
};

export const removeFromCart = async (req, res) => {
  console.log("🛒 Delete request received for ID:", req.params.id);

  if (!req.params.id) {
    return res.status(400).json({ message: "Cart item ID missing" });
  }

  try {
    const deleted = await CartItem.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item removed successfully" });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ message: "Error removing item" });
  }
};

// POST /api/checkout
export const checkout = async (req, res) => {
  try {
    const items = await CartItem.find().populate("productId");

    // अगर productId undefined है तो fallback 0
    const total = items.reduce((sum, item) => {
      const price = item.productId ? item.productId.price : 0;
      return sum + price * item.qty;
    }, 0);

    const timestamp = new Date().toISOString();
    await CartItem.deleteMany({});

    res.json({
      message: "Checkout successful",
      total,
      timestamp,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ message: "Error during checkout" });
  }
};
