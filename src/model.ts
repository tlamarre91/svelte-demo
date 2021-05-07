import mongodb from "mongodb";

export interface Participant {
  name: string;
}

export type Event = [winnerIndex: number, loserIndex: number];

export class Bracket {
  name: string;
  userId?: mongodb.ObjectId;
  createdAt: Date;
  finalized: boolean;
  participants: Participant[];
  events: Event[];
  constructor(opts: Partial<Bracket>) {
    this.name = opts.name ?? "";
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
