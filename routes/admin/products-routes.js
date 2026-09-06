const express = require('express')
const {
    handleImageUpload, 
    addProduct, 
    editProduct, 
    deleteProduct, 
    fetchAllProducts 
} = require('../../controllers/admin/products-controller')
const { upload } = require("../../helpers/upload");
const { authMiddleware } = require('../../controllers/auth/auth-controller')
const adminMiddleware = require('../../middleware/admin');

const router = express.Router()

// All admin product routes require authentication
router.use(authMiddleware)
router.use(adminMiddleware);

router.post(
    '/upload-image',
    upload.single('my_file'),
    handleImageUpload
);
router.post('/add', addProduct)
router.put('/edit/:id', editProduct)
router.delete('/delete/:id', deleteProduct)
router.get('/get', fetchAllProducts)

module.exports = router