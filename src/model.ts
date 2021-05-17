import type mongodb from "mongodb";
import { generateSlug } from "random-word-slugs";

export interface Participant {
  name: string;
}

export const randomParticipant = () => ({
  name: generateSlug(2, { format: "title" }),
});

export type Event = [winnerIndex: number, loserIndex: number];

export class Bracket {
  name: string;
  slug?: string;
  userId?: mongodb.ObjectId;
  createdAt: Date;
  finalized: boolean;
  participants: Participant[];
  events: Event[];
  constructor(opts: Partial<Bracket>) {
    this.name = opts.name ?? "";
    this.slug = opts.slug;
    this.userId = opts.userId;
    this.finalized = opts.finalized ?? false;
    this.createdAt = opts.createdAt ?? new Date();
    this.participants = opts.participants ?? [];
    this.events = opts.events ?? [];
  }

  // pushParticipant(participant: Participant) {
  //   this.participants
  // }
}
