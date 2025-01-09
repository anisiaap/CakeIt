const mongoose = require('mongoose');

const BakerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  passwordHashed: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  rating: { type: Number },
  imageUrl: { type: String },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectionReason: { type: String }, // Optional field for rejection reason
  fiscalDocuments: { type: [String], required: true  }, // Array of file references
  sanepidApproval: { type: String, required: true  }, // File reference
  bankDetails: {
    iban: { type: String, required: true  },
    bankName: { type: String, required: true  },
    accountOwner: { type: String, required: true  },
  },
  locationProof: { type: String, required: true  }, // File reference
});

module.exports = mongoose.model('Bakery', BakerySchema);
