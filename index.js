const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require('./routes/product');
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const cors = require("cors");
const multer = require('multer');
const path = require('path');

dotenv.config();
app.use(cors());
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

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use('/api/products', productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);
app.use('/api/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
})