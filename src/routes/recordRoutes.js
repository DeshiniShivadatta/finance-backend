const express = require('express');
const router = express.Router();
const {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord
} = require('../controllers/recordController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

// Viewer, analyst, admin can view
router.get('/', authorize('viewer', 'analyst', 'admin'), getAllRecords);
router.get('/:id', authorize('viewer', 'analyst', 'admin'), getRecordById);

// Only admin can create, update, delete
router.post('/', authorize('admin'), createRecord);
router.put('/:id', authorize('admin'), updateRecord);
router.delete('/:id', authorize('admin'), deleteRecord);

module.exports = router;
