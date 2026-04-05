const pool = require('../config/db');

// Create record (admin only)
const createRecord = async (req, res) => {
  const { amount, type, category, date, notes } = req.body;

  if (!amount || !type || !category || !date) {
    return res.status(400).json({ error: 'Amount, type, category and date are required.' });
  }

  const validTypes = ['income', 'expense'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: 'Type must be income or expense.' });
  }

  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO financial_records (amount, type, category, date, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [amount, type, category, date, notes || null, req.user.id]
    );
    res.status(201).json({ message: 'Record created successfully.', record: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating record.' });
  }
};

// Get all records with filters (admin, analyst, viewer)
const getAllRecords = async (req, res) => {
  const { type, category, start_date, end_date, page = 1, limit = 10 } = req.query;

  let query = `SELECT * FROM financial_records WHERE is_deleted = FALSE`;
  const params = [];
  let count = 1;

  if (type) {
    query += ` AND type = $${count++}`;
    params.push(type);
  }
  if (category) {
    query += ` AND category ILIKE $${count++}`;
    params.push(`%${category}%`);
  }
  if (start_date) {
    query += ` AND date >= $${count++}`;
    params.push(start_date);
  }
  if (end_date) {
    query += ` AND date <= $${count++}`;
    params.push(end_date);
  }

  // Pagination
  const offset = (page - 1) * limit;
  query += ` ORDER BY date DESC LIMIT $${count++} OFFSET $${count++}`;
  params.push(limit, offset);

  try {
    const result = await pool.query(query, params);
    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total: result.rows.length,
      records: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching records.' });
  }
};

// Get single record
const getRecordById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM financial_records WHERE id = $1 AND is_deleted = FALSE',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Record not found.' });
    }
    res.json({ record: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching record.' });
  }
};

// Update record (admin only)
const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { amount, type, category, date, notes } = req.body;

  const validTypes = ['income', 'expense'];
  if (type && !validTypes.includes(type)) {
    return res.status(400).json({ error: 'Type must be income or expense.' });
  }

  if (amount && (isNaN(amount) || amount <= 0)) {
    return res.status(400).json({ error: 'Amount must be a positive number.' });
  }

  try {
    const existing = await pool.query(
      'SELECT id FROM financial_records WHERE id = $1 AND is_deleted = FALSE',
      [id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Record not found.' });
    }

    const result = await pool.query(
      `UPDATE financial_records SET
        amount = COALESCE($1, amount),
        type = COALESCE($2, type),
        category = COALESCE($3, category),
        date = COALESCE($4, date),
        notes = COALESCE($5, notes),
        updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [amount || null, type || null, category || null, date || null, notes || null, id]
    );

    res.json({ message: 'Record updated successfully.', record: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating record.' });
  }
};

// Soft delete record (admin only)
const deleteRecord = async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await pool.query(
      'SELECT id FROM financial_records WHERE id = $1 AND is_deleted = FALSE',
      [id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Record not found.' });
    }

    await pool.query(
      'UPDATE financial_records SET is_deleted = TRUE, updated_at = NOW() WHERE id = $1',
      [id]
    );

    res.json({ message: 'Record deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting record.' });
  }
};

module.exports = { createRecord, getAllRecords, getRecordById, updateRecord, deleteRecord };