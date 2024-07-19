const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
const app = express();
const corsOptions = {
  origin: "http://localhost:4200", // Adjust this to match the URL of your Angular app
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/portal", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Replace useCreateIndex with createIndexes
    // createIndexes: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
// Define User Model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, match: /\S+@\S+\.\S+/ },
  password: { type: String, required: true, minlength: 6 },
});
const User = mongoose.model("User", UserSchema);
// Define Student Model
const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollno: { type: String, required: true, unique: true },
  subject: { type: String, required: true },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
const Student = mongoose.model("Student", StudentSchema);
// JWT Secret
const JWT_SECRET = "your_jwt_secret";
// Signup Route
app.post(
  "/signup",
  [
    body("username").not().isEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Email is invalid"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password } = req.body;
    try {
      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Save user
      user = new User({ username, email, password: hashedPassword });
      await user.save();
      // Generate JWT
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
      res.status(201).json({ token });
    } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);
// Login Route
app.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email is invalid"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      // Generate JWT
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
      res.status(200).json({ token });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);
// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Access denied" });
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(400).json({ message: "Invalid token" });
  }
};
// Create Student
app.post(
  "/teacher/addstudent",
  verifyToken,
  [
    body("name").not().isEmpty().withMessage("Student name is required"),
    body("rollno").not().isEmpty().withMessage("Roll number is required"),
    body("subject").not().isEmpty().withMessage("Subject is required"),
  ],
  async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, rollno, subject } = req.body;
    try {
      // Check if student already exists
      let student = await Student.findOne({ rollno, teacher: req.user.id });
      if (student) {
        return res
          .status(400)
          .json({ message: "Student with this roll number already exists" });
      }
      // Save student
      student = new Student({ name, rollno, subject, teacher: req.user.id });
      await student.save();
      res.status(201).json({ student });
    } catch (err) {
      console.error("Add student error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);
// Get All Students for the Logged-in Teacher
app.get("/teacher/students", verifyToken, async (req, res) => {
  try {
    const students = await Student.find({ teacher: req.user.id });
    res.status(200).json({ students });
  } catch (err) {
    console.error("Get students error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Get Single Student by Roll Number
app.get("/teacher/student/:rollno", verifyToken, async (req, res) => {
  try {
    const student = await Student.findOne({
      rollno: req.params.rollno,
      teacher: req.user.id,
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ student });
  } catch (err) {
    console.error("Get student by rollno error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Update Student
app.put(
  "/teacher/student/:rollno",
  verifyToken,
  [
    body("name")
      .optional()
      .not()
      .isEmpty()
      .withMessage("Student name is required"),
    body("subject")
      .optional()
      .not()
      .isEmpty()
      .withMessage("Subject is required"),
  ],
  async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, subject } = req.body;
    try {
      // Update student
      const student = await Student.findOneAndUpdate(
        { rollno: req.params.rollno, teacher: req.user.id },
        { $set: { name, subject } },
        { new: true, runValidators: true }
      );
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.status(200).json({ student });
    } catch (err) {
      console.error("Update student error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);
// Delete Student
app.delete("/teacher/student/:rollno", verifyToken, async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({
      rollno: req.params.rollno,
      teacher: req.user.id,
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted" });
  } catch (err) {
    console.error("Delete student error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Logout Route
app.post("/logout", verifyToken, (req, res) => {
  // For simplicity, assuming token is valid, simply return success
  res.status(200).json({ message: "Logout successful" });
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});