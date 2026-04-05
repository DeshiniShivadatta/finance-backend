const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ users: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching users.' });
  }
};

// Get single user
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, status, created_at FROM users WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching user.' });
  }
};

// Update user role or status (admin only)
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { role, status } = req.body;

  const validRoles = ['viewer', 'analyst', 'admin'];
  const validStatuses = ['active', 'inactive'];

  if (role && !validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role.' });
  }
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const result = await pool.query(
      `UPDATE users SET
        role = COALESCE($1, role),
        status = COALESCE($2, status)
       WHERE id = $3
       RETURNING id, name, email, role, status`,
      [role || null, status || null, id]
    );

    res.json({ message: 'User updated successfully.', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating user.' });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  const { id } = req.params;

  // Prevent admin from deleting themselves
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ error: 'You cannot delete your own account.' });
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting user.' });
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };