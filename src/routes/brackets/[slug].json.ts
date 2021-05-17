import type express from "express";
import { Bracket } from "@/model";
import db from "@/db";

export async function get(
  req: express.Request,
  res: express.Response,
  next: () => void
) {
  const { slug } = req.params;
  const bracket = await db.getBracketBySlug(slug);
  res.json(bracket);
}

export async function post(
  req: express.Request,
  res: express.Response,
  next: () => void
) {
  const { slug } = req.params;
  const { body } = req;
}

export async function del(
  req: express.Request,
  res: express.Response,
  next: () => void
) {
  const { slug } = req.params;
}
