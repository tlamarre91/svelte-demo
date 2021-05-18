import express from "express";
import * as sapper from "@sapper/server";
import session from "express-session";
import MongoStore from "connect-mongo";

import dotenv from "dotenv";
dotenv.config();
const { PORT, NODE_ENV, JWT_SECRET } = process.env;

const dev = NODE_ENV === "development";

// TODO: rename JWT_SECRET => SESSION_SECRET
if (JWT_SECRET == undefined) {
  throw new Error("JWT_SECRET environment variable not set");
}

const mongoUrl = "mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb";

// TODO: Could register middleware in a single app.use()
const app = express();
app.use(express.static("static"));
app.use(express.json());
app.use(
  session({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      // TODO: could use existing db connection
      mongoUrl,
      dbName: "svelte-demo",
    }),
  })
);
app.use(sapper.middleware()); // Make sure this is registered last, so Sapper endpoints can use middleware
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
