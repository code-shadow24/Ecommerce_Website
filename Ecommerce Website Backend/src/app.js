import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
    origin: process.env.CORS_URL
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(express.static("public"))
app.use(cookieParser());

//import routes
import userRouter from "./routes/user.routes.js";
import sellerRouter from "./routes/seller.routes.js";


//routes declarations
app.use("/api/v1/users", userRouter);
app.use("/api/v1/seller", sellerRouter);


export {app}