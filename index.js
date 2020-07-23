const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to Database"));

app.use(cors());
app.use(express.json());

const categoryRouter = require("./routes/categoryRouter");
app.use("/categories", categoryRouter);

const productRouter = require("./routes/productRouter");
app.use("/products", productRouter);

app.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
