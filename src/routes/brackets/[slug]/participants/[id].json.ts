import type express from "express";
import { Bracket, Participant } from "@/model";
import db from "@/db";

export async function get(
  req: express.Request,
  res: express.Response,
  next: () => void
) {
  const { slug: bracketSlug, id: participantIndex } = req.params;
  const bracket = await db.getUserBracketBySlug(req.session.id, bracketSlug);
  const idx = parseInt(participantIndex);
  if (isNaN(idx)) {
    res.status(400);
    const error = `Participant index must be an integer`;
    return res.json({ error });
  }
  if (bracket == null) {
    res.status(404);
    const error = `Bracket with slug ${bracketSlug} does not exist`;
    return res.json({ error });
  }
  const participant = bracket.participants[idx];
  return res.json(participant);
}

/**
 * Update an existing participant by index
 */
export async function put(
  req: express.Request,
  res: express.Response,
  next: () => void
) {
  const { slug: bracketSlug, id: participantIndex } = req.params;
  const { body } = req;
}

export async function del(
  req: express.Request,
  res: express.Response,
  next: () => void
) {
  const { slug: bracketSlug } = req.params;
}
