const express = require('express');
const {
    handleUserImageUpload,
    addUserProduct,
    getUserProducts,
    editUserProduct,
    deleteUserProduct
} = require('../../controllers/user/products-controller');
const { upload } = require("../../helpers/upload");
const { authMiddleware } = require('../../controllers/auth/auth-controller');

const router = express.Router();

// All user product routes require authentication
router.use(authMiddleware);

// Image upload for products
router.post('/upload-image', upload.single('my_file'), handleUserImageUpload);

// CRUD operations for user's own products
router.post('/add', addUserProduct);
router.get('/my-products', getUserProducts);
router.put('/edit/:id', editUserProduct);
router.delete('/delete/:id', deleteUserProduct);

module.exports = router;