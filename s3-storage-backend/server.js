import express from "express";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { ProductModel } from "./product.model.js";
import { connectToDB } from "./db.js";
import cors from "cors";
import logger from "./logger.js";
import morgan from "morgan";

dotenv.config();

const app = express();
const PORT = 3200;
const morganFormat = ":method :url :status :response-time ms";

app.use(express.json());
app.use(cors());
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const createPresignedUrlWithClient = ({ bucket, key }) => {
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 3600 });
};

app.post("/get-presigned-url", async (req, res) => {
  const { mime } = req.body;

  const fileName = uuidv4();
  const finalname = `${fileName}.${mime}`;
  const url = await createPresignedUrlWithClient({
    bucket: process.env.S3_BUCKET_NAME,
    key: finalname,
  });

  res.json({ url: url, finalname: finalname });
});

app.post("/products", async (req, res) => {
  const { name, description, price, filename } = req.body;


  

  // TODO: Validate the request using zod

  if (!name || !description || !price || !filename) {
    res.json({ message: "All fields are required" });
    return;
  }



  const product = await ProductModel.create({
    name,
    description,
    price,
    filename,
  });

  console.log(`product: ${product}`);

  res.json({ message: "success" });
});



app.get("/products", async (req, res) => {
  const product = await ProductModel.find()
  res.json(product)

})

app.listen(PORT, () => {
  connectToDB();
  console.log(`Example app listening on port ${PORT}`);
});
