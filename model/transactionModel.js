const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    payer: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model("transaction", transactionSchema);