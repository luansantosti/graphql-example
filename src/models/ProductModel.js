const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category'
  },
},
{ collection: 'product' })

const product = mongoose.model('product', productSchema);

module.exports = product;