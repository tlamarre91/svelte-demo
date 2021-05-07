import sirv from "sirv";
import express from "express";
import compression from "compression";
import * as sapper from "@sapper/server";
import expressJwt from "express-jwt";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

const app = express();
app.use(express.static("static"));
app.use(express.json());
app.use(sapper.middleware());
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
