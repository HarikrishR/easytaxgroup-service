const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

// Assuming controller.js and joiSchema.js are correctly reachable
const usdotController = require('./controller');
// const JoiValidator = require('./middleware/JoiValidator'); 
const { createUsdotApplicationSchema } = require('./joiSchema');

// Define the storage configuration for multer
const storage = multer.diskStorage({
  // Store files in a folder named 'licenses' inside the 'uploads' directory
  destination: (req, file, cb) => {
    // NOTE: You must ensure the directory 'uploads/licenses' exists!
    // path.join(__dirname, '..', 'uploads', 'licenses') assumes the routes file is inside a 'routes' or 'modules/user' folder.
    cb(null, path.join(__dirname, '..', 'uploads', 'licenses')); 
  },
  // Use the unique name passed from the frontend for the file name on disk
  // --- UPDATED FILENAME FUNCTION ---
  filename: (req, file, cb) => {
    // The unique filename is sent from the client as the third argument 
    // of FormData.append(key, file, uniqueFileName), which Multer exposes as 
    // file.originalname for fields that are files.
    
    // Note: The original 'originalname' field in Multer's file object will 
    // actually contain the unique name we passed from the frontend.
    const uniqueFileName = file.originalname;

    // You should still have the full extension, but if you want to be safe, 
    // ensure no extension is missing.
    if (uniqueFileName) {
        cb(null, uniqueFileName);
    } else {
        // Fallback for safety, though this should not be hit now.
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname || ''));
    }
  }
});

// Multer instance to handle file uploads for the two licenses
const upload = multer({ storage: storage }).fields([
    { name: 'driversLicense', maxCount: 1 },
    { name: 'businessLicense', maxCount: 1 }
]);

// ------------------------------------
// USDOT Application Creation Route
// ------------------------------------
router.post(
  '/usdotapplication',
  // 1. Multer processes files (stores them) and populates req.body with text fields
  upload, 
  // 2. Joi validates the populated req.body
//   JoiValidator.validate(createUsdotApplicationSchema), 
  // 3. Controller executes with a fully populated req.body
  usdotController.createUsdotapplication 
);

module.exports = router;