// Server to handle file uploads (npm install express multer)

// Import required modules
const express = require('express');
const multer  = require('multer');
const path = require('path');
const fs = require('fs');

// Define constants
const app = express();
const dataDir = path.join(__dirname, '/data');

// Create /data directory if it doesn't exist
if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir);
}

// Set up multer to store files in the /data directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, dataDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

// Define POST endpoint for file upload
app.post('/api/upload', upload.single('file'), (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file was uploaded' });
    }
    res.json({ message: 'File uploaded successfully' });
}, (error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during file upload' });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});