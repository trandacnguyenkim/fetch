const mongoose = require('mongoose');

const payerSchema = new mongoose.Schema({
    payer: {
        type: String,
        unique: true,
        required: true,
    },
    points: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("payer", payerSchema);