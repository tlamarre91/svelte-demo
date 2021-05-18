import type mongodb from "mongodb";
import { generateSlug } from "random-word-slugs";

export class Participant {
  name: string;
  // TODO: add createdAt, etc
  constructor(opts: Partial<Participant>) {
    this.name = opts.name ?? "";
  }
}

export const makeRandomParticipant = (): Participant => ({
  name: generateSlug(2, { format: "title" }),
});

export type Event = [winnerIndex: number, loserIndex: number];

export class Bracket {
  name: string;
  slug?: string; // TODO: better handling of where slug gets generated
  userId: string;
  createdAt: Date;
  lastModifiedAt: Date;
  finalizedAt: Date | null;
  participants: Participant[];
  events: Event[];
  constructor(opts: Partial<Bracket>) {
    if (opts.userId == undefined) {
      // TODO: just define a type with some optional, some required args
      throw new Error("Bracket must have userId");
    }
    this.name = opts.name ?? "";
    this.slug = opts.slug;
    this.userId = opts.userId;
    this.finalizedAt = opts.finalizedAt ?? null;
    this.createdAt = opts.createdAt ?? new Date();
    this.lastModifiedAt = opts.lastModifiedAt ?? new Date();
    this.participants = opts.participants ?? [];
    this.events = opts.events ?? [];
  }

  // pushParticipant(participant: Participant) {
  //   this.participants
  // }
}
