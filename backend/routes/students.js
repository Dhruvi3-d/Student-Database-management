const express = require("express");
const Student = require("../models/Student");
const auth = require("../middleware/auth");

const router = express.Router();

// GET /students  -> public (shown on the home page, same as exp17.onrender.com/students)
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ _id: 1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /students -> teacher only
router.post("/", auth, async (req, res) => {
  try {
    const { name, age, course } = req.body;
    if (!name || !age || !course)
      return res.status(400).json({ message: "Name, age and course are required" });

    const student = await Student.create({ name, age, course, addedBy: req.teacher.id });
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /students/:id -> teacher only
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, age, course } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, age, course },
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /students/:id -> teacher only
router.delete("/:id", auth, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
