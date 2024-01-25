// Server to handle file uploads
// npm install express multer
const express = require('express');
const multer  = require('multer');
const path = require('path');

const app = express();

const fs = require('fs');
const dataDir = path.join(__dirname, '/data');
if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir);
}

// Set up multer to store files in the /data directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = path.join(__dirname, '/data');
        console.log('Destination directory:', destinationPath);
        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        console.log('File name:', file.originalname);
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

// app.post('/api/upload', upload.single('file'), (req, res) => {
//     res.json({ message: 'File uploaded successfully' });
// });
app.post('/api/upload', upload.single('file'), (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file was uploaded' });
    }
    console.log('Saved file:', path.join(__dirname, '/data', req.file.filename));
    res.json({ message: 'File uploaded successfully' });
}, (error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during file upload' });
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});