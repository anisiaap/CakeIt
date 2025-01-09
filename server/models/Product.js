const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  bakeryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bakery',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  ingredients: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  weight: {
    type: Number,
    required: true,
    min: 0, // Weight in grams
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  image: {
    type: String, // File path or URL to the image
    required: true,
  },
});

module.exports = mongoose.model('Product', ProductSchema);
