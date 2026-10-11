const express = require('express');
const router = express.Router();
const db = require('../db');

function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.status(401).json({ message: 'Unauthorized. Please login.' });
}

// GET all employees (with department info)
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT e.*, d.DepartmentName, d.GrossSalary as DeptGrossSalary
      FROM Employee e
      LEFT JOIN Department d ON e.DepartmentCode = d.DepartmentCode
      ORDER BY e.EmployeeNumber DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// GET single employee
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT e.*, d.DepartmentName
      FROM Employee e
      LEFT JOIN Department d ON e.DepartmentCode = d.DepartmentCode
      WHERE e.EmployeeNumber = ?
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Employee not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// POST create employee
router.post('/', isAuthenticated, async (req, res) => {
  const { FirstName, LastName, Position, Address, Telephone, Gender, HiredDate, DepartmentCode } = req.body;
  if (!FirstName || !LastName || !Position || !Address || !Telephone || !Gender || !HiredDate || !DepartmentCode) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const [result] = await db.execute(
      'INSERT INTO Employee (FirstName, LastName, Position, Address, Telephone, Gender, HiredDate, DepartmentCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [FirstName, LastName, Position, Address, Telephone, Gender, HiredDate, DepartmentCode]
    );
    res.status(201).json({ message: 'Employee created successfully.', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;
