const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const productRoute = require('./routes/product');
const categoryRoute = require('./routes/categories');
const multer = require('multer');
const path = require('path');

dotenv.config();
app.use(express.json());
app.use('/upload', express.static(path.join(__dirname, '/uploads')));

//DB Connection
mongoose.connect(
    process.env.MONGODB_URI, {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
)
.then(console.log('MongoDB connected...'))
.catch((err) => console.log(err));



//uploading Images
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb (null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb (null, req.body.name);
    },
});

const fileFilter = (req, file, cb) => {
    //reject a file
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb (null, true);
    } else {
        cb (null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
app.post('/api/upload', upload.single('file'), (req, res) => {
    res.status(200).json('File has been uploaded');
});

app.use('/api/categories', categoryRoute);
app.use('/api/products', productRoute);
app.use('/api/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
})