const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");

const router = express.Router();

const makeToken = (t) =>
  jwt.sign({ id: t._id, name: t.name, email: t.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, inviteCode } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email and password are required" });
    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const required = process.env.TEACHER_INVITE_CODE;
    if (required && inviteCode !== required)
      return res.status(403).json({ message: "Invalid teacher invite code" });

    if (await Teacher.findOne({ email: email.toLowerCase() }))
      return res.status(409).json({ message: "A teacher with this email already exists" });

    const hash = await bcrypt.hash(password, 10);
    const teacher = await Teacher.create({ name, email, password: hash });

    res.status(201).json({
      token: makeToken(teacher),
      teacher: { id: teacher._id, name: teacher.name, email: teacher.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const teacher = await Teacher.findOne({ email: email.toLowerCase() });
    if (!teacher || !(await bcrypt.compare(password, teacher.password)))
      return res.status(401).json({ message: "Incorrect email or password" });

    res.json({
      token: makeToken(teacher),
      teacher: { id: teacher._id, name: teacher.name, email: teacher.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
