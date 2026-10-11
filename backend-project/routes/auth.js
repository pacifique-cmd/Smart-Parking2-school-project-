const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    !username.trim() ||
    !password
  ) {
    return res.status(400).json({
      message: 'Username and password required.'
    });
  }

  try {
    const [rows] = await db.execute(
      'SELECT id, username, password FROM Users WHERE username = ?',
      [username.trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: 'Invalid credentials.'
      });
    }

    const user = rows[0];

    if (
      typeof user.password !== 'string' ||
      !user.password.startsWith('$2') ||
      user.password.length !== 60
    ) {
      console.error(
        'Login failed: invalid password hash for user ID:',
        user.id
      );

      return res.status(500).json({
        message: 'Account password is not configured correctly.'
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        message: 'Invalid credentials.'
      });
    }

    req.session.user = {
      id: user.id,
      username: user.username
    };

    return res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);

    return res.status(500).json({
      message: 'Server error.'
    });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  if (!req.session) {
    return res.json({
      message: 'Logged out successfully.'
    });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err.message);

      return res.status(500).json({
        message: 'Logout failed.'
      });
    }

    res.clearCookie('connect.sid');

    return res.json({
      message: 'Logged out successfully.'
    });
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({
      loggedIn: true,
      user: req.session.user
    });
  }

  return res.status(401).json({
    loggedIn: false
  });
});

// POST /api/auth/register
// Keep this route restricted to authorized setup/admin use.
router.post('/register', async (req, res) => {
  const { username, password } = req.body || {};

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    !username.trim() ||
    !password
  ) {
    return res.status(400).json({
      message: 'Username and password required.'
    });
  }

  if (Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(400).json({
      message: 'Password must not exceed 72 bytes.'
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      'INSERT INTO Users (username, password) VALUES (?, ?)',
      [username.trim(), hashedPassword]
    );

    return res.status(201).json({
      message: 'User created successfully.'
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        message: 'Username already exists.'
      });
    }

    console.error('Registration error:', err.message);

    return res.status(500).json({
      message: 'Server error.'
    });
  }
});

module.exports = router;