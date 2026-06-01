const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const addressController = require('../controllers/addressController');

const router = express.Router();

// All address routes require authentication
router.use(protect);

// Address CRUD endpoints
router.post('/', addressController.createAddress);
router.get('/', addressController.getAddresses);

// Special endpoints
router.get('/default', addressController.getDefaultAddress);
router.put('/:addressId/set-default', addressController.setDefaultAddress);

router.put('/:addressId', addressController.updateAddress);
router.delete('/:addressId', addressController.deleteAddress);

module.exports = router;
