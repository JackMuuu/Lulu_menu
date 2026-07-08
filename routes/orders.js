const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

router.use(express.json());

router.post('/', requireAuth, orderController.createOrder);
router.get('/mine', requireAuth, orderController.getMyOrders);
router.delete('/:id', requireAuth, orderController.deleteMyOrder);

module.exports = router;