import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import session from 'express-session'

const app = express();

app.use(cors({
    origin: process.env.CORS_URL
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(express.static("public"))
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

//import routes
import activitylogRouter from "./routes/activitylogs.routes.js";
import addressRouter from "./routes/address.routes.js";
import adminRouter from "./routes/admin.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";
import blogRouter from "./routes/blog.routes.js";
import cartRouter from "./routes/cart.routes.js";
import categoryRouter from "./routes/category.routes.js";
import couponRouter from "./routes/coupon.routes.js";
import crmticketRouter from "./routes/crmticket.routes.js";
import inventoryRouter from "./routes/inventory.routes.js";
import orderRouter from "./routes/order.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import permissionRouter from "./routes/permission.routes.js";
import productRouter from "./routes/product.routes.js";
import ratingsRouter from "./routes/ratings.routes.js";
import returnRouter from "./routes/return.routes.js";
import sellerRouter from "./routes/seller.routes.js";
import sellernotificationRouter from "./routes/sellernotification.routes.js";
import shipmentRouter from "./routes/shipment.routes.js";
import subcategoryRouter from "./routes/subcategory.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import taxRouter from "./routes/tax.routes.js";
import userRouter from "./routes/user.routes.js";
import usernotificationRouter from "./routes/usernotification.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";


//routes declarations
app.use("/api/v1/activitylog", activitylogRouter);
app.use("/api/v1/addresses", addressRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/crmticket", crmticketRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/permission", permissionRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/rating", ratingsRouter);
app.use("/api/v1/return", returnRouter);
app.use("/api/v1/seller", sellerRouter);
app.use("/api/v1/sellernotification", sellernotificationRouter);
app.use("/api/v1/shipment", shipmentRouter);
app.use("/api/v1/subcategory", subcategoryRouter);
app.use("/api/v1/subscription", subscriptionRouter);
app.use("/api/v1/tax", taxRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/usernotification", usernotificationRouter);
app.use("/api/v1/wishlist", wishlistRouter);

export {app}