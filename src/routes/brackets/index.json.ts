import type express from "express";
import { Bracket, Participant } from "../../model";
import db from "../../db";

const GENERATED_PARTICIPANT_COUNT = 8;

export async function get(
  req: express.Request,
  res: express.Response,
  next: () => void
) {
  const brackets = await db.getUserBrackets(req.session.id);
  res.json(brackets);
}

export async function post(
  req: express.Request,
  res: express.Response,
  next: () => void
) {
  const bracket = new Bracket({ userId: req.session.id, ...req.body });
  if (req.body.generateParticipants) {
    for (let i = 0; i < GENERATED_PARTICIPANT_COUNT; i += 1) {
      bracket.participants.push(Participant.makeRandom());
    }
  }
  await db.addUserBracket(req.session.id, bracket);
  res.json(bracket);
}
