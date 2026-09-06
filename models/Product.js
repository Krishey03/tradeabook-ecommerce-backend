const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  image: {
    type: String,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    trim: true,
  },
  isbn: {
    type: String,
    trim: true,
  },
  publisher: {
    type: String,
    trim: true,
  },
  publicationDate: {
    type: String,
    trim: true,
  },
  edition: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  seller: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  sellerEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  sellerPhone: {
    type: String,
    trim: true,
  },
  buyerEmail: {
    type: String,
    lowercase: true,
    trim: true,
  },
  isSold: {
    type: Boolean,
    default: false,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PaymentTransaction",
  },
  paymentDate: {
    type: Date,
  },
  paymentExpiresAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model("Product", ProductSchema);