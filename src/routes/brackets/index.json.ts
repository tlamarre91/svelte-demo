import type express from "express";
import { Bracket } from "../../model";
import db from "../../db";

export async function get(
  req: express.Request,
  res: express.Response,
  next: () => void
) {
  const brackets = await db.getAllBrackets();
  // console.log("GET brackets: ", brackets);
  res.json(brackets);
}

export async function post(
  req: express.Request,
  res: express.Response,
  next: () => void
) {
  const bracket = new Bracket(req.body);
  await db.addBracket(bracket);
  // console.log("POST bracket: ", bracket);
  res.json(bracket);
}
