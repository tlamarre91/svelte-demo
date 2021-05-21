import { generateSlug } from "random-word-slugs";

export class Participant {
  name: string;
  createdAt: Date;
  lastModifiedAt: Date;
  removedAt: Date | null;
  constructor(opts: Partial<Participant>) {
    // TODO: default name should probably be null.
    this.name = opts.name ?? "";
    this.createdAt = opts.createdAt ?? new Date();
    this.lastModifiedAt = opts.lastModifiedAt ?? new Date();
    this.removedAt = opts.removedAt ?? null;
  }

  static makeRandom() {
    return new Participant({
      name: generateSlug(2, { format: "title" }),
    });
  }
}

/**
 * A pending or completed match in a Bracket. A null participant field means
 * that a previous match hasn't been reported to determine the winner that will
 * proceed to this match.
 */
export class Match {
  /**
   * First participant. If pending is false, this is the winner.
   */
  participant1: number | null;
  /**
   * Second participant. If pending is false, this is the loser.
   */
  participant2: number | null;
  /**
   * If true, this is a yet-to-be-played match; otherwise, it is a match with a
   * winner and a loser.
   */
  pending: boolean;
  constructor(
    participant1?: number | null,
    participant2?: number | null,
    pending = true
  ) {
    if (!pending && !(participant1 != null && participant2 != null)) {
      console.log("values:", participant1, participant2, pending);
      throw new Error(
        "Match without both participants must have pending set to true."
      );
    }
    this.participant1 = participant1 ?? null;
    this.participant2 = participant2 ?? null;
    this.pending = pending;
  }
}

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
   * many rounds will it last? Integer ceiling of log_2(this.participants.length)
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
    return roundMatches.findIndex(
      ({ participant1: winner, participant2: loser }: Match) => {
        return (p1 == winner && p2 == loser) || (p2 == winner && p1 == loser);
      }
    );
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

    const r = this.computeTotalRounds() - 1;
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
   * Does our Map of matches have a match for this participant in this round?
   *
   * @param round
   *   Key of this.matches to check.
   * @param participantIndex
   *   Index [0, ..., this.participants.length - 1] of participant in
   *   this.participants.
   * @param includePending
   *   If true, return true if match is pending. Otherwise, pending matches
   *   don't count.
   */
  matchExists(
    round: number,
    participantIndex: number,
    includePending: boolean = false
  ) {
    const roundMatches = this.matches.get(round);
    if (roundMatches == undefined) {
      return false;
    }
    return roundMatches.some(
      ({ participant1: winner, participant2: loser, pending }: Match) => {
        return (
          (includePending || !pending) &&
          (participantIndex == winner || participantIndex == loser)
        );
      }
    );
  }

  /**
   * Does our Map of matches have a *win* for this participant in this round?
   */
  winExists(round: number, participantIndex: number) {
    const roundMatches = this.matches.get(round);
    if (roundMatches == undefined) {
      return false;
    }
    return roundMatches.some(({ participant1: winner, pending }: Match) => {
      return !pending && participantIndex == winner;
    });
  }

  /**
   * Given the current Map of matches, have both of this match's participants
   * won the necessary rounds to meet each other? If either participant is null,
   * we say that the match is valid.
   */
  matchIsValid({ participant1: winner, participant2: loser }: Match) {
    if (winner == null || loser == null) return true;
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
  pushPendingMatch(match: Match, round: number) {
    if (!this.finalizedAt) {
      throw new Error(
        "Can't push pending match to bracket that hasn't been finalized."
      );
    }
    // const { participant1: p1, participant2: p2, pending } = match;
    if (!pending) {
      throw new Error("Can't add a non-pending match with pushPendingMatch.");
    }
    // const round = this.computeMatchRound(p1, p2);
    if (!this.matchIsValid(match)) {
      // TODO: matchIsValid should really tell us why a match isn't valid.
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
   *
   * @param match
   *   The match to report. Note: `pending` will be set to false, regardless of
   *   value of match[2].
   */
  reportMatch(match: Match) {
    if (!this.finalizedAt) {
      throw new Error(
        "Can't push match result to bracket that hasn't been finalized."
      );
    }

    const { participant1: p1, participant2: p2 } = match;
    if (p1 == null || p2 == null) {
      throw new Error(
        "Reporting a match requires both participants to be defined."
      );
    }
    const computedRound = this.computeMatchRound(p1, p2);
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
    const { pending: ePending } = existingMatch;
    if (!ePending) {
      throw new Error(
        `Can't report match: match ${existingMatch} in round ${computedRound} is already reported.`
      );
    }

    Object.assign(existingMatch, { ...match, pending: false });
  }

  /**
   * Validate that this bracket is ready to be finalized, meaning that we're
   * ready to start pushing match results.
   *
   * @param validateOnly
   *   Just check that this bracket is ready to be finalized. Don't actually
   *   set finalizedAt.
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

  /**
   * Unset finalizedAt and clear all matches.
   */
  unfinalize() {
    if (!this.finalizedAt) {
      throw new Error("Can't unfinalize a bracket that isn't finalized.");
    }
    this.finalizedAt = null;
    this.matches = new Map();
  }
}
