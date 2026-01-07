const express = require("express");
const cors = require("cors");

//routes
const authRoutes = require('./routes/auth.routes')
const couponRoutes = require("./routes/coupon.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();

app.use(cors({
    origin:"*"
}));
app.use(express.json());

app.use('/auth',authRoutes);
app.use("/coupons", couponRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

module.exports = app;
