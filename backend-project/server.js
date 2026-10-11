const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const departmentRoutes = require('./routes/departments');
const salaryRoutes = require('./routes/salary');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'epms_secret_2025',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true in production with HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 8 // 8 hours
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/salary', salaryRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'EPMS Backend API is running', version: '1.0.0' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ EPMS Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${process.env.DB_NAME || 'EPMS'} @ ${process.env.DB_HOST || 'localhost'}`);
});
