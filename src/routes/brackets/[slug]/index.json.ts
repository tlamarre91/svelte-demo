import type express from "express";
import { Bracket } from "@/model";
import db from "@/db";

export async function get(
  req: express.Request,
  res: express.Response,
  next: () => void
) {
  const { slug } = req.params;
  const bracket = await db.getUserBracketBySlug(req.session.id, slug);
  if (bracket == null) {
    const error = `Bracket not found: ${slug}`;
    res.status(404);
    return res.json({ error });
  }
  return res.json(bracket);
}

// TODO: this should be `put`
export async function post(
  req: express.Request,
  res: express.Response,
  next: () => void
) {
  const { slug } = req.params;
  const { body } = req;
  const result = await db.updateUserBracket(req.session.id, slug, body);
  if (result == null) {
    res.status(400); // TODO: 400 might not be right
    const error = `Could not update bracket ${slug}`;
    res.json({ error });
  } else {
    res.json({ success: true });
  }
}

export async function del(
  req: express.Request,
  res: express.Response,
  next: () => void
) {
  const { slug } = req.params;
  const result = await db.deleteUserBracket(req.session.id, slug);
  return res.json({ result });
}
