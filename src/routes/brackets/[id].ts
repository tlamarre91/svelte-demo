// import type { SapperRequest, SapperResponse } from "@sapper/server";
import type express from "express";
import { Bracket } from "../../model";
import db from "../../db";

export async function get(
  req: express.Request,
  res: express.Response,
  next: () => void
) {
  const { id } = req.params;
  const bracket = await db.getBracket(id);
}

export async function post(
  req: express.Request,
  res: express.Response,
  next: () => void
) {
  const { id } = req.params;
  const { body } = req;
}

export async function del(
  req: express.Request,
  res: express.Response,
  next: () => void
) {
  const { id } = req.params;
}
