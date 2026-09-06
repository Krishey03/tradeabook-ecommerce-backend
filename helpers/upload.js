const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'Product_Images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Remove spaces and special characters
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(cleanName);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  console.log('📤 Uploading:', file.originalname);
  console.log('📋 MIME type:', file.mimetype);
  
  // Accept all image types, plus unknown binary
  const allowedMimeTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 
    'image/gif', 'image/webp', 'image/bmp',
    'image/tiff', 'image/svg+xml',
    'application/octet-stream' // Accept unknown binary files
  ];
  
  // Check allowed extensions
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.svg'];
  const isValidExt = allowedExtensions.includes(ext);
  
  // Accept if MIME is allowed OR extension is allowed
  if (allowedMimeTypes.includes(file.mimetype) || isValidExt) {
    console.log('✅ File accepted as image');
    return cb(null, true);
  }
  
  console.log('❌ File rejected - not an image');
  cb(new Error(`Only image files are allowed. Received: ${file.mimetype} with extension ${ext}`));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

const getImageUrl = (filename) => {
  return `/uploads/${filename}`;
};

module.exports = { upload, getImageUrl };