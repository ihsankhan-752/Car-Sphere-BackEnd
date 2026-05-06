import express from "express";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js";
import sellerRouter from "./routes/seller.route.js";
import listingRouter from "./routes/listing.route.js";
import favouriteRouter from "./routes/favourite.route.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";

const app = express();

const PORT = process.env.PORT ?? 8000;

app.use(express.json());

app.get("/health", (req, res) => {
  return res.json({ message: "Server is Up and running" });
});

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/seller", sellerRouter);
app.use("/listing", listingRouter);
app.use("/favourite", favouriteRouter);

//=============ErrorMiddleware we will keep it in the bottom==================//
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is UP & Running on PORT: ${PORT}`);
});
