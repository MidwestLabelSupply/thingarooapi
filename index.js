const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const datauri = require("datauri/parser");
const multer = require("multer");
const path = require("path");
const verifyToken = require("./AuthCheck");
const mustache = require('mustache-express');

const app = express();
const PORT = process.env.PORT || 8080;

const corsOptions = {
  origin: [
    "https://admin.thingaroo.com",
    "https://verify.thingaroo.com"
  ],
  optionsSuccessStatus: 200,
};

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', __dirname + '/templates');
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors(corsOptions));

// Connect to the Database
console.log(process.env.MONGODB_URI)
mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb://root:rootpassword@localhost:27017"
);
mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected!!!!");
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || "dj4tverha",
  api_key: process.env.CLOUD_API_KEY ||"797151567589932",
  api_secret: process.env.CLOUD_API_SECRET ||"DLTyU1M1AD84eAF-T5xDOGhSsV4",
  secure: true,
});

// Data parsing
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
const storage = multer.memoryStorage();
const dUri = new datauri();
const dataUri = (req) =>
  dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

function uploadFile(req, res, next) {
  const upload = multer({ storage }).single("file");
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {

      return res.status(500).status({ err });
    } else if (err) {
      // An unknown error occurred when uploading

      return res.status(500).status({ err });
    }
    // Everything went fine.
    next();
  });

}

app.post("/api/fileUpload", verifyToken, uploadFile, (req, res) => {
  if (req.file) {
    const file = dataUri(req).content;
    console.log(Date.now());
    return cloudinary.uploader
      .upload(file, { resource_type: "auto", timeout: 600000 })
      .then((result) => {
        const image = result.secure_url;
        console.log(Date.now());
        return res.status(200).json({
          result,
          msg: "Your image has been uploded successfully to cloudinary",
          data: {
            image,
          },
        });
      })
      .catch((err) =>
        res.status(400).json({
          msg: "someting went wrong while processing your request",
          data: {
            err,
          },
        })
      );
  } else return res.status(500).send({ msg: "file is missing." });
});
app.use("/admin", require("./routes/admin"));
app.use("/order", require("./routes/order"));
app.use("/order-detail", require("./routes/orderDetail"));

app.listen(PORT, console.log(`Server is starting at "${PORT}"`));
