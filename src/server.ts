// import sirv from "sirv";
import express from "express";
// import compression from "compression";
import * as sapper from "@sapper/server";
import expressJwt from "express-jwt";

import dotenv from "dotenv";
dotenv.config();
const { PORT, NODE_ENV, JWT_SECRET } = process.env;

const dev = NODE_ENV === "development";

if (JWT_SECRET == undefined) {
  throw new Error("JWT_SECRET environment variable not set");
}

const app = express();
app.use(express.static("static"));
app.use(express.json());
app.use(sapper.middleware());
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
