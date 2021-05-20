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

export type Match = [winnerIndex: number, loserIndex: number, pending: boolean];

export class Bracket {
  name: string;
  slug?: string; // TODO: better handling of where slug gets generated
  userId: string;
  createdAt: Date;
  lastModifiedAt: Date;
  finalizedAt: Date | null;
  participants: Participant[];
  /**
   * Map from round number to a list of Matches in that round.
   */
  matches: Map<number, Match[]>;
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
    this.matches = opts.matches ?? new Map();
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
   * If a match between these two participant indices, in this round, has been
   * recorded, return its index in the matches array. If not, return -1.
   */
  findMatch(p1: number, p2: number, round: number) {
    const roundMatches = this.matches.get(round);
    if (roundMatches == undefined) {
      return -1;
    }
    return roundMatches.findIndex(([winner, loser]) => {
      return (p1 == winner && p2 == loser) || (p2 == winner && p1 == loser);
    });
  }

  /**
   * In how many matches has each participant index appeared?
   *
   * TODO: instead return Map(participant => [wins, losses]) like countMatches.
   */
  // countAllMatches() {
  //   let counts = this.participants.map(() => 0);
  //   this.matches.values().forEach(([winner, loser]) => {
  //     counts[winner] += 1;
  //     counts[loser] += 1;
  //   });

  //   return counts;
  // }

  // /**
  //  * Compute [wins, losses] for each participant argument.
  //  */
  // countMatches(...pIndices: number[]) {
  //   let counts = new Map<number, [number, number]>(
  //     // Initialize a map with 0 wins, 0 losses for each participant index.
  //     pIndices.map((p) => [p, [0, 0]])
  //   );
  //   this.matches.forEach(([winner, loser]) => {
  //     const wCount = counts.get(winner);
  //     if (wCount != undefined) wCount[0] += 1;
  //     const lCount = counts.get(loser);
  //     if (lCount != undefined) lCount[1] += 1;
  //   });

  //   return counts;
  // }

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
   * Does our Map of matches have a non-pending match for this participant in this round?
   */
  matchExists(round: number, participantIndex: number) {
    const roundMatches = this.matches.get(round);
    if (roundMatches == undefined) {
      return false;
    }
    return roundMatches.some(([winner, loser, pending]) => {
      return (
        !pending && (participantIndex == winner || participantIndex == loser)
      );
    });
  }

  /**
   * Does our Map of matches have a *win* for this participant in this round?
   */
  winExists(round: number, participantIndex: number) {
    const roundMatches = this.matches.get(round);
    if (roundMatches == undefined) {
      return false;
    }
    return roundMatches.some(([winner, loser, pending]) => {
      return !pending && participantIndex == winner;
    });
  }

  /**
   * Given the current Map of matches, have both of this match's participants
   * won the right number of rounds to meet each other?
   */
  matchIsValid([winner, loser, pending]: Match) {
    if (winner < 0 || loser < 0 || winner == loser) return false;

    const computedRound = this.computeMatchRound(winner, loser);
    // Check that we don't already have a match (pending or not) for either
    // participant in the appropriate round.
    const cond =
      this.matchExists(computedRound, winner) ||
      this.matchExists(computedRound, loser);
    if (cond) {
      return false;
    }
    // Check that both participants won matches in all the previous rounds.
    for (let round = 0; round < computedRound; round += 1) {
      const cond = !(
        this.winExists(round, winner) && this.winExists(round, loser)
      );
      if (cond) {
        return false;
      }
    }

    return true;
  }

  /**
   * Add a (pending) match to our Map of matches. Don't call this with matches
   * that have already been played. First, add a pending match, then call
   * reportMatch.
   */
  pushMatch(match: Match) {
    const [p1, p2, pending] = match;
    if (!pending) {
      throw new Error("Can't add a non-pending match with pushMatch.");
    }
    const round = this.computeMatchRound(p1, p2);
    if (!this.matchIsValid(match)) {
      throw new Error(`Can't push invalid match: ${match}`);
    }
    const roundMatches = this.matches.get(round);
    if (roundMatches == undefined) {
      this.matches.set(round, [match]);
    } else {
      roundMatches.push(match);
    }
  }

  /**
   * Update a pending match with the actual results of the match, after
   * checking that this operation is valid.
   */
  reportMatch(match: Match) {
    const [p1, p2, _] = match;
    const computedRound = this.computeMatchRound(p1, p2);
    // if (pending) {
    //   const err =
    //     "Can't call reportMatch with a pending match. First pass this match to pushMatch.";
    //   throw new Error(err);
    // }
    const existingMatchIndex = this.findMatch(p1, p2, computedRound);
    if (existingMatchIndex == -1) {
      const err = `Pending match not found in round ${computedRound} for participants ${p1} and ${p2}`;
      throw new Error(err);
    }
    const roundMatches = this.matches.get(computedRound);
    if (roundMatches == undefined) {
      // TODO: this check is probably not necessary, since we just called
      // findMatch and it succeeded.
      throw new Error(`Error finding match ${match} in round ${computedRound}`);
    }
    const existingMatch = roundMatches[existingMatchIndex];
    const [, , ePending] = existingMatch;
    if (!ePending) {
      throw new Error(
        `Can't report match: match ${existingMatch} in round ${computedRound} is already reported.`
      );
    }

    existingMatch[0] = match[0];
    existingMatch[1] = match[1];
    existingMatch[2] = false; // Set pending to false.
  }

  /**
   * Validate that this bracket is ready to be finalized. If validateOnly is
   * false, set finalizedAt.
   */
  finalize(validateOnly = false) {
    if (this.finalizedAt) {
      return; // TODO: should this throw?
    }
    const nParticipants = this.participants.length;
    const lp = Math.log2(nParticipants);
    if (!Number.isInteger(lp)) {
      const nextPow = Math.pow(2, Math.ceil(lp));
      const err = `Number of participants must be a power of 2. (Current count: ${nParticipants}. Add ${
        nextPow - nParticipants
      } more.)`;
      throw new Error(err);
    }

    if (validateOnly) {
      return;
    }

    this.finalizedAt = new Date();
  }
}
