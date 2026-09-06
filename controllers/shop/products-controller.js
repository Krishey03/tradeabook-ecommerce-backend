const Product = require('../../models/Product');
const Order = require('../../models/Order');
const PaymentTransaction = require('../../models/paymentTransaction');

// ========== PUBLIC ROUTES ==========

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({ isSold: false });
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

const getProductDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).lean();

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json(product);
    } catch (e) {
        console.error("Product details error:", e);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// ========== PROTECTED ROUTES ==========

// Buy product (add to cart)
const buyProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { buyerEmail } = req.body;
        const io = req.app.get('io');

        if (!buyerEmail) {
            return res.status(400).json({ 
                success: false,
                message: "Buyer email is required." 
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: "Product not found." 
            });
        }

        if (product.isSold) {
            return res.status(400).json({ 
                success: false,
                message: "Product is already sold." 
            });
        }

        if (product.sellerEmail === buyerEmail) {
            return res.status(400).json({ 
                success: false,
                message: "You cannot buy your own product." 
            });
        }

        product.buyerEmail = buyerEmail;
        await product.save();

        if (io) {
            io.emit("productUpdated", { productId: product._id });
        }

        res.status(200).json({
            success: true,
            message: "Product added to cart successfully",
            product: product
        });

    } catch (error) {
        console.error("Error buying product:", error);
        res.status(500).json({ 
            success: false,
            message: error.message || "Failed to buy product" 
        });
    }
};

// Get cart items
const getCartItems = async (req, res) => {
    try {
        const { email } = req.params;
        console.log("Fetching cart items for:", email);

        const cartItems = await Product.find({
            buyerEmail: email,
            isSold: false,
            paymentStatus: { $nin: ["paid", "refunded"] }
        });

        res.status(200).json({ 
            success: true, 
            data: cartItems 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching cart items.",
            error: error.message
        });
    }
};

// Get cart items for checkout (with total)
const getCartItemsForCheckout = async (req, res) => {
    try {
        const { buyerEmail } = req.params;
        
        const products = await Product.find({
            buyerEmail: buyerEmail,
            isSold: false,
            paymentStatus: 'pending'
        });

        const total = products.reduce((sum, p) => sum + p.price, 0);

        res.status(200).json({
            success: true,
            data: products,
            total: total
        });
    } catch (error) {
        console.error("Error fetching cart items for checkout:", error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Get seller orders
const getSellerOrders = async (req, res) => {
    try {
        const { sellerEmail } = req.params;
        
        const orders = await Order.find({ seller: sellerEmail })
            .populate('product')
            .populate('paymentId')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error("Error fetching seller orders:", error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Get buyer orders
const getBuyerOrders = async (req, res) => {
    try {
        const { buyerEmail } = req.params;
        
        const orders = await Order.find({ buyer: buyerEmail })
            .populate('product')
            .populate('paymentId')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error("Error fetching buyer orders:", error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Update order status (accept/cancel)
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        
        if (!['pending', 'accepted', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be: pending, accepted, or cancelled'
            });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.status = status;
        await order.save();

        // If order is accepted, mark product as sold
        if (status === 'accepted') {
            await Product.findByIdAndUpdate(order.product, { isSold: true });
        }

        // If order is cancelled, free up the product
        if (status === 'cancelled') {
            await Product.findByIdAndUpdate(order.product, { 
                isSold: false,
                buyerEmail: null 
            });
        }

        const io = req.app.get('io');
        if (io) {
            io.emit('orderUpdated', { orderId: order._id });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

module.exports = { 
    getProducts, 
    getProductDetails, 
    buyProduct,
    getCartItems,
    getCartItemsForCheckout,
    getSellerOrders,
    getBuyerOrders,
    updateOrderStatus
};