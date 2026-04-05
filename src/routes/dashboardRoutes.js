const express = require('express');
const router = express.Router();
const {
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getWeeklyTrends,
  getRecentActivity
} = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

// Viewer can only see summary and recent activity
router.get('/summary', authorize('viewer', 'analyst', 'admin'), getSummary);
router.get('/recent', authorize('viewer', 'analyst', 'admin'), getRecentActivity);

// Analyst and admin can see detailed insights
router.get('/categories', authorize('analyst', 'admin'), getCategoryTotals);
router.get('/trends/monthly', authorize('analyst', 'admin'), getMonthlyTrends);
router.get('/trends/weekly', authorize('analyst', 'admin'), getWeeklyTrends);

module.exports = router;