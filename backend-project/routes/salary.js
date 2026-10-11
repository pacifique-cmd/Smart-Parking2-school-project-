const express = require('express');
const router = express.Router();
const db = require('../db');

function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.status(401).json({ message: 'Unauthorized. Please login.' });
}

// GET all salary records (with employee info)
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT s.*, e.FirstName, e.LastName, e.Position, d.DepartmentName
      FROM Salary s
      JOIN Employee e ON s.EmployeeNumber = e.EmployeeNumber
      LEFT JOIN Department d ON e.DepartmentCode = d.DepartmentCode
      ORDER BY s.SalaryID DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// GET salary by ID
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT s.*, e.FirstName, e.LastName, e.Position, d.DepartmentName
      FROM Salary s
      JOIN Employee e ON s.EmployeeNumber = e.EmployeeNumber
      LEFT JOIN Department d ON e.DepartmentCode = d.DepartmentCode
      WHERE s.SalaryID = ?
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Salary record not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// POST create salary
router.post('/', isAuthenticated, async (req, res) => {
  const { EmployeeNumber, GrossSalary, TotalDeduction, Month } = req.body;
  if (!EmployeeNumber || !GrossSalary || !TotalDeduction || !Month) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const [result] = await db.execute(
      'INSERT INTO Salary (EmployeeNumber, GrossSalary, TotalDeduction, Month) VALUES (?, ?, ?, ?)',
      [EmployeeNumber, GrossSalary, TotalDeduction, Month]
    );
    res.status(201).json({ message: 'Salary record created successfully.', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// PUT update salary
router.put('/:id', isAuthenticated, async (req, res) => {
  const { EmployeeNumber, GrossSalary, TotalDeduction, Month } = req.body;
  if (!EmployeeNumber || !GrossSalary || !TotalDeduction || !Month) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const [result] = await db.execute(
      'UPDATE Salary SET EmployeeNumber = ?, GrossSalary = ?, TotalDeduction = ?, Month = ? WHERE SalaryID = ?',
      [EmployeeNumber, GrossSalary, TotalDeduction, Month, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Salary record not found.' });
    res.json({ message: 'Salary record updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// DELETE salary
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM Salary WHERE SalaryID = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Salary record not found.' });
    res.json({ message: 'Salary record deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// GET monthly payroll report
router.get('/report/monthly', isAuthenticated, async (req, res) => {
  const { month } = req.query;
  try {
    let query = `
      SELECT e.FirstName, e.LastName, e.Position, d.DepartmentName,
             s.GrossSalary, s.TotalDeduction, s.NetSalary, s.Month, s.SalaryID
      FROM Salary s
      JOIN Employee e ON s.EmployeeNumber = e.EmployeeNumber
      LEFT JOIN Department d ON e.DepartmentCode = d.DepartmentCode
    `;
    const params = [];
    if (month) {
      query += ' WHERE s.Month = ?';
      params.push(month);
    }
    query += ' ORDER BY s.Month, e.LastName';
    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;
