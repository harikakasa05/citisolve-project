const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

router.post("/", async (req, res) => {
    try {
        const newComplaint = new Complaint(req.body);
        const savedComplaint = await newComplaint.save();

        res.status(201).json({
            message: "Complaint created successfully",
            complaint: savedComplaint,
        });
    } catch (error) {
        console.error("Create Error:", error.message);
        res.status(500).json({ message: "Error creating complaint" });
    }
});

router.get("/", async (req, res) => {
  try {
    const user = req.user;   // comes from auth middleware

    let complaints;

    if (user.role === "admin") {
      // admin can see everything
      complaints = await Complaint.find().populate("userId", "name email");
    } else {
      // citizen sees only their complaints
      complaints = await Complaint.find({ userId: user.id });
    }

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// router.get("/", async (req, res) => {
//     try {
//         const complaints = await Complaint.find().sort({ createdAt: -1 });
//         res.status(200).json(complaints);
//     } catch (error) {
//         console.error("Fetch Error:", error.message);
//         res.status(500).json({ message: "Error fetching complaints" });
//     }
// });

router.delete("/:id", async (req, res) => {
    try {
        const deletedComplaint = await Complaint.findByIdAndDelete(req.params.id);

        if (!deletedComplaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json({ message: "Complaint deleted successfully" });
    } catch (error) {
        console.error("Delete Error:", error.message);
        res.status(500).json({ message: "Error deleting complaint" });
    }
});

module.exports = router;