import type express from "express";
import { Bracket, Participant } from "@/model";
import db from "@/db";

/**
 * Add a new participant to an existing bracket
 */
export async function post(
  req: express.Request,
  res: express.Response,
  next: () => void
) {
  const { slug: bracketSlug } = req.params;
  const { body } = req;
}
