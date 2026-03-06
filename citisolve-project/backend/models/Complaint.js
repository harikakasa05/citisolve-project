const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
    name: String,
    ward: String,
    location: String,
    category: String,
    description: String,
    photo: String,
    status: {
        type: String,
        default: "Pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);