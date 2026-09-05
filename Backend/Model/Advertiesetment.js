const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
    seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    },
    title: { 
    type: String, 
    required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true 
    },
    unit: { 
        type: String, 
        default: 'kg' 
    },
    pricePerUnit: { 
        type: Number, 
        required: true 
    },
    harvestDate: { 
        type: Date, 
        required: true 
    },
    district: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    isOrganic: { 
        type: Boolean, 
        default: false 
    },
    acceptsBids: { 
        type: Boolean, 
        default: false 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    organicLevel:{ 
        type: String, 
        required: true 
    },
    packaging:{ 
        type: String, 
        required: true 
    },
    images: [{ 
        type: String, 
        required: true 
    }],
});

module.exports = mongoose.model('Advertisement', advertisementSchema);