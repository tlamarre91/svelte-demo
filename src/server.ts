import express from "express";
import * as sapper from "@sapper/server";
import session from "express-session";
import MongoStore from "connect-mongo";

// TODO: don't repeat dotenv.config() here and in db.ts
import dotenv from "dotenv";
dotenv.config();
const { PORT, NODE_ENV, JWT_SECRET, MONGODB_URI } = process.env;

const dev = NODE_ENV == "development";

// TODO: rename JWT_SECRET => SESSION_SECRET
if (JWT_SECRET == undefined) {
  throw new Error("JWT_SECRET environment variable not set");
}
if (MONGODB_URI == undefined) {
  throw new Error("MONGODB_URI environment variable not set");
}

const mongoUrl = MONGODB_URI;

// TODO: Could register middleware in a single app.use()
const app = express();
app.use(express.static("static"));
app.use(express.json());
app.use(
  session({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false
    },
    store: MongoStore.create({
      // TODO: could use existing db connection
      mongoUrl,
      dbName: "svelte-demo",
    }),
  })
);
// Make sure this is registered last, so Sapper endpoints can use middleware:
app.use(sapper.middleware());
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
