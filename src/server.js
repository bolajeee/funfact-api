import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { isPerfect, isArmstrong, DEFINITIONS } from "../utilities/utils.js";
import serverless from "serverless-http";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/classify-number", async (req, res) => {
   const result = await handler({
     queryStringParameters: req.query,
   });
   res.status(result.statusCode).set(result.headers).send(result.body);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
