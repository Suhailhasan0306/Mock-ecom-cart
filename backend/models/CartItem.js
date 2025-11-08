import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  qty: { type: Number, default: 1 },
});

const CartItem = mongoose.model("CartItem", cartItemSchema);
export default CartItem;
