const pool = require('../config/db');

// Total income, expenses, net balance
const getSummary = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) AS net_balance
      FROM financial_records
      WHERE is_deleted = FALSE
    `);

    res.json({ summary: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching summary.' });
  }
};

// Category wise totals
const getCategoryTotals = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        category,
        type,
        COALESCE(SUM(amount), 0) AS total,
        COUNT(*) AS count
      FROM financial_records
      WHERE is_deleted = FALSE
      GROUP BY category, type
      ORDER BY total DESC
    `);

    res.json({ category_totals: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching category totals.' });
  }
};

// Monthly trends
const getMonthlyTrends = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        TO_CHAR(date, 'YYYY-MM') AS month,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) AS net
      FROM financial_records
      WHERE is_deleted = FALSE
      GROUP BY month
      ORDER BY month DESC
    `);

    res.json({ monthly_trends: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching monthly trends.' });
  }
};

// Weekly trends
const getWeeklyTrends = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        TO_CHAR(DATE_TRUNC('week', date), 'YYYY-MM-DD') AS week_starting,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) AS net
      FROM financial_records
      WHERE is_deleted = FALSE
      GROUP BY week_starting
      ORDER BY week_starting DESC
    `);

    res.json({ weekly_trends: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching weekly trends.' });
  }
};

// Recent activity (last 10 records)
const getRecentActivity = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        fr.*,
        u.name AS created_by_name
      FROM financial_records fr
      LEFT JOIN users u ON fr.created_by = u.id
      WHERE fr.is_deleted = FALSE
      ORDER BY fr.created_at DESC
      LIMIT 10
    `);

    res.json({ recent_activity: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching recent activity.' });
  }
};

module.exports = {
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getWeeklyTrends,
  getRecentActivity
};