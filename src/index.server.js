const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv');
const path = require('path');
const cors = require('cors');
const app = express();

// routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin/auth');
const initDataRoutes = require('./routes/admin/initData');
const pageRoutes = require('./routes/admin/page');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const addressRoutes = require('./routes/address');
const orderRoutes = require('./routes/order');
const adminOrderRoute = require("./routes/admin/order");

// environment valirables or constants
env.config();

// mongodb connection
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.q3qzc.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }
).then(() => {
    console.log('Database connected successfully.')
});

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use('/public', express.static(path.join(__dirname, 'uploads')));
app.use('/api', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', initDataRoutes);
app.use('/api', pageRoutes);
app.use('/api', orderRoutes);
app.use('/api', addressRoutes);
app.use('/api', adminOrderRoute);

// running on port 3000
app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
});