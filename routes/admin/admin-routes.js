const express = require('express');
const router = express.Router();
const { getAllUsers, toggleBlockUser, getAllOrders, deleteUser } = require('../../controllers/admin/admin-controller');
const { authMiddleware } = require('../../controllers/auth/auth-controller');
const adminMiddleware = require('../../middleware/admin');

// All admin routes require authentication
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/users', getAllUsers);
router.put('/users/:id/block', toggleBlockUser);
router.get('/orders', getAllOrders);
router.delete('/users/:id/delete', deleteUser);

module.exports = router;