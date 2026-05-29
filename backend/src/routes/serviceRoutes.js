const express = require('express');
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getMyServices,
  approveService,
  rejectService,
  getAllAdminServices
} = require('../controllers/serviceController');

const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public routes
router.get('/', getServices);
router.get('/:id', getServiceById);

// Provider routes
router.get('/provider/my-services', protect, authorizeRoles('provider'), getMyServices);
router.post('/', protect, authorizeRoles('provider'), upload.array('images', 5), createService);
router.put('/:id', protect, authorizeRoles('provider'), upload.array('images', 5), updateService);
router.delete('/:id', protect, authorizeRoles('provider'), deleteService);

// Admin routes
router.get('/admin/all', protect, authorizeRoles('admin'), getAllAdminServices);
router.patch('/:id/approve', protect, authorizeRoles('admin'), approveService);
router.patch('/:id/reject', protect, authorizeRoles('admin'), rejectService);

module.exports = router;