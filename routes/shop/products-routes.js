const express = require('express')
const { 
    getProducts, 
    getProductDetails, 
    buyProduct,
    getCartItems,
    getSellerOrders,
    getBuyerOrders,
    updateOrderStatus,
    getCartItemsForCheckout
} = require('../../controllers/shop/products-controller')
const { authMiddleware } = require('../../controllers/auth/auth-controller')

const router = express.Router()

// Public routes - anyone can view products
router.get('/get', getProducts)
router.get('/get/:id', getProductDetails)

// Protected routes - require authentication
router.use(authMiddleware)

router.get("/cart/:email", getCartItems)
router.get("/cart/checkout/:buyerEmail", getCartItemsForCheckout)
router.get("/orders/seller/:sellerEmail", getSellerOrders)
router.get("/orders/buyer/:buyerEmail", getBuyerOrders)
router.patch("/orders/:orderId", updateOrderStatus)
router.post("/:productId/buy", buyProduct)

module.exports = router