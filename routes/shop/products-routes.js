const express = require('express');
const { 
    getProducts, 
    getProductDetails, 
    buyProduct,
    getCartItems,
    getCartItemsForCheckout,
    getSellerOrders,
    getBuyerOrders,
    updateOrderStatus
} = require('../../controllers/shop/products-controller');
const { requireAuth } = require('../../middleware/auth');  // ← Use requireAuth

const router = express.Router();

// ========== PUBLIC ROUTES (No login required) ==========
router.get('/get', getProducts);
router.get('/get/:id', getProductDetails);

// ========== PROTECTED ROUTES (Login required) ==========
router.use(requireAuth);  // ← Now uses requireAuth

// Cart routes
router.get('/cart/:email', getCartItems);
router.get('/cart/checkout/:buyerEmail', getCartItemsForCheckout);

// Order routes
router.get('/orders/seller/:sellerEmail', getSellerOrders);
router.get('/orders/buyer/:buyerEmail', getBuyerOrders);

// Order actions
router.patch('/orders/:orderId', updateOrderStatus);

// Buy product
router.post('/:productId/buy', buyProduct);

module.exports = router;