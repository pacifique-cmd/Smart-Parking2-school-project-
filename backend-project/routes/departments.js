const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware: check session
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.status(401).json({ message: 'Unauthorized. Please login.' });
}

// GET all departments
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Department');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// GET single department
router.get('/:code', isAuthenticated, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Department WHERE DepartmentCode = ?', [req.params.code]);
    if (rows.length === 0) return res.status(404).json({ message: 'Department not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// POST create department
router.post('/', isAuthenticated, async (req, res) => {
  const { DepartmentCode, DepartmentName, GrossSalary } = req.body;
  if (!DepartmentCode || !DepartmentName || !GrossSalary) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    await db.execute(
      'INSERT INTO Department (DepartmentCode, DepartmentName, GrossSalary) VALUES (?, ?, ?)',
      [DepartmentCode, DepartmentName, GrossSalary]
    );
    res.status(201).json({ message: 'Department created successfully.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Department code already exists.' });
    }
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;
