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

export type Match = [winnerIndex: number, loserIndex: number];

export class Bracket {
  name: string;
  slug?: string; // TODO: better handling of where slug gets generated
  userId: string;
  createdAt: Date;
  lastModifiedAt: Date;
  finalizedAt: Date | null;
  participants: Participant[];
  matches: Match[];
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
    this.matches = opts.matches ?? [];
  }

  /**
   * If we start the tournament with the current number of participants, how
   * many rounds will it last?
   */
  computeTotalRounds() {
    const np = this.participants.length;
    if (np < 2) {
      return 0;
    } else {
      return Math.ceil(Math.log2(np));
    }
  }

  /**
   * If a match between these two participant indices has been recorded, return
   * its index in the matches array. If not, return -1.
   */
  findMatch(p1: number, p2: number) {
    return this.matches.findIndex(([ep1, ep2]) => {
      return (p1 == ep1 && p2 == ep2) || (p2 == ep1 && p1 == ep2);
    });
  }

  /**
   * In how many matches has each participant index appeared?
   */
  countAllMatches() {
    let counts = this.participants.map(() => 0);
    this.matches.forEach(([mp1, mp2]) => {
      counts[mp1] += 1;
      counts[mp2] += 1;
    });

    return counts;
  }

  /**
   * In how many matches have these specific participant indices appeared?
   */
  countMatches(...ps: number[]) {
    let counts = ps.map(() => 0);
    ps.forEach((p, pIndex) => {
      this.matches.forEach(([mp1, mp2]) => {
        if (mp1 == p || mp2 == p) {
          counts[pIndex] += 1;
        }
      });
    });

    return counts;
  }

  /**
   * In which (0-indexed!) round would a hypothetical match between these two participant
   * indices occur? Returns 0 if arguments are equal.
   *
   * This funky function works backwards from the root of the bracket (viewed
   * like a binary tree) and finds the first node where p1 is on one side and
   * p2 is on the other. I'm pretty sure there's a simpler way to do this.
   */
  computeMatchRound(p1: number, p2: number) {
    if (
      p1 < 0 ||
      p2 < 0 ||
      p1 >= this.participants.length ||
      p2 >= this.participants.length
    ) {
      throw new Error(`Illegal arguments: ${p1}, ${p2}`);
    }
    if (p1 == p2) {
      return 0;
    }

    const r = this.computeTotalRounds() - 1; // Subtract 1 to get 0-indexed answer.
    for (let i = r; i >= 0; i -= 1) {
      const pow = Math.pow(2, i);
      const sideOfP1 = Math.floor(p1 / pow);
      const sideOfP2 = Math.floor(p2 / pow);
      if (sideOfP1 != sideOfP2) {
        return i;
      }
    }
    return 0;
  }

  /**
   * Given the current match array, have these participants played the right
   * number of matches to face each other? e.g. if these participants meet in
   * round 2 (0-indexed), have they both appeared in 2 matches?
   *
   * TODO: really, this should count *wins*
   */
  matchIsValid([mp1, mp2]: Match) {
    if (mp1 < 0 || mp2 < 0 || mp1 == mp2) return false;
    const counts = this.countMatches(mp1, mp2);
    const round = this.computeMatchRound(mp1, mp2);
    return counts[0] == round && counts[1] == round;
  }
}
