const Order = require('../models/Order');
const Dish = require('../models/Dish');

function generateOrderNo() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');

  // Example: 20260708-195233-127
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}-${String(d.getMilliseconds()).padStart(3, '0')}`;
}

exports.createOrder = async (req, res, next) => {
  try {

    const { items, note = '' } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order items are required' });
    }

    const orderNo = generateOrderNo();

    const normalizedItems = [];

    for (const item of items) {
      const dishId = item.dishId || item.dish || item._id;
      const quantity = Number(item.quantity || 1);

      if (!dishId || !Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid cart item' });
      }

      const dish = await Dish.findById(dishId).lean();
      if (!dish) {
        return res.status(404).json({ error: `Dish not found: ${dishId}` });
      }

      normalizedItems.push({
        dish: dish._id,
        nameSnapshot: dish.name,
        quantity,
        imageSnapshot: dish.image || '',
      });
    }

    const order = await Order.create({
      orderNo,
      user: req.user._id,
      items: normalizedItems,
      note,
    });

    return res.status(201).json({
      ok: true,
      order,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ ok: true, orders });
  } catch (err) {
    next(err);
  }
};

exports.deleteMyOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;

    const deleted = await Order.findOneAndDelete({
      _id: orderId,
      user: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.json({
      ok: true,
      message: 'Order deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};