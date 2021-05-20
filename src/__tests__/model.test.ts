import * as model from "../model";

const names = [
  "Skinny Balloon",
  "Odd Library",
  "Savory Candle",
  "Square Rose",
  "Breezy Truck",
  "Wrong Restaurant",
  "Moldy Guitar",
  "Cuddly Planet",
];

describe("Bracket model", () => {
  let bracket: model.Bracket;
  const userId = "testId";
  const name = "testName";

  beforeEach(() => {
    const participants = names.map((name) => ({ name }));
    bracket = new model.Bracket({ userId, name, participants });
  });

  test("Smoke test", () => {
    expect(bracket.userId).toBe(userId);
    expect(bracket.name).toBe(name);
    expect(bracket.participants).toMatchSnapshot();
  });

  test("findMatch", () => {
    const matches: model.Match[] = [
      [0, 1, true],
      [3, 2, true],
      [0, 3, true],
    ];
    bracket.pushMatch(matches[0]);
    bracket.reportMatch(matches[0]);
    bracket.pushMatch(matches[1]);
    bracket.reportMatch(matches[1]);
    bracket.pushMatch(matches[2]);
    expect(bracket.findMatch(0, 1, 0)).toBe(0);
    expect(bracket.findMatch(3, 2, 0)).toBe(1);
    expect(bracket.findMatch(0, 3, 1)).toBe(0);
    expect(bracket.findMatch(1, 3, 0)).toBe(-1);
  });

  test("computeTotalRounds", () => {
    expect(bracket.computeTotalRounds()).toBe(3);
    bracket.participants.push(...bracket.participants);
    // Double the participant count => one more round.
    expect(bracket.computeTotalRounds()).toBe(4);
    bracket.participants.push(...bracket.participants);
    expect(bracket.computeTotalRounds()).toBe(5);
  });

  test("computeMatchRound throws with out-of-bounds arguments", () => {
    expect(() =>
      bracket.computeMatchRound(-1, 2)
    ).toThrowErrorMatchingInlineSnapshot(`"Illegal arguments: -1, 2"`);
    expect(() =>
      bracket.computeMatchRound(3, -1)
    ).toThrowErrorMatchingInlineSnapshot(`"Illegal arguments: 3, -1"`);
    expect(() =>
      bracket.computeMatchRound(3, 8)
    ).toThrowErrorMatchingInlineSnapshot(`"Illegal arguments: 3, 8"`);
    expect(() =>
      bracket.computeMatchRound(8, 3)
    ).toThrowErrorMatchingInlineSnapshot(`"Illegal arguments: 8, 3"`);
  });

  test("computeMatchRound with 8 participants", () => {
    // Worked out a few test cases by hand:
    expect(bracket.computeMatchRound(0, 0)).toBe(0);
    expect(bracket.computeMatchRound(0, 1)).toBe(0);
    expect(bracket.computeMatchRound(0, 2)).toBe(1);
    expect(bracket.computeMatchRound(2, 5)).toBe(2);
    expect(bracket.computeMatchRound(0, 7)).toBe(2);
  });

  test("computeMatchRound with 16 participants", () => {
    bracket.participants.push(...bracket.participants);
    // These cases are the same as when participants.length == 8:
    expect(bracket.computeMatchRound(0, 0)).toBe(0);
    expect(bracket.computeMatchRound(0, 1)).toBe(0);
    expect(bracket.computeMatchRound(0, 2)).toBe(1);
    expect(bracket.computeMatchRound(2, 5)).toBe(2);
    expect(bracket.computeMatchRound(0, 7)).toBe(2);

    // Check some new cases:
    expect(bracket.computeMatchRound(7, 8)).toBe(3);
    expect(bracket.computeMatchRound(8, 9)).toBe(0);
    expect(bracket.computeMatchRound(11, 12)).toBe(2);
    expect(bracket.computeMatchRound(14, 15)).toBe(0);
    expect(bracket.computeMatchRound(4, 10)).toBe(3);
  });

  test("winExists returns true when participant has a win in the specified round", () => {
    const p1 = 0;
    const p2 = 1;
    bracket.pushMatch([p1, p2, true]);
    bracket.reportMatch([p1, p2, false]);
    expect(bracket.winExists(0, p1)).toBe(true);
  });

  test("winExists returns false when participant does not have a win in the specified round", () => {
    const p1 = 0;
    const p2 = 1;
    bracket.pushMatch([p1, p2, true]);
    bracket.reportMatch([p1, p2, false]);
    expect(bracket.winExists(0, p2)).toBe(false);
  });

  test("matchIsValid correctly identifies when a match is valid", () => {
    const m1: model.Match = [0, 2, true];
    // These participants don't meet before they've played 1 round each.
    console.log("matches:", bracket.matches);
    expect(bracket.matchIsValid(m1)).toBe(false);
    // bracket.matches.push([0, 1, 0]);
    // bracket.matches.push([2, 3, 0]);
    bracket.pushMatch([0, 1, true]);
    bracket.pushMatch([2, 3, true]);
    bracket.reportMatch([0, 1, false]);
    bracket.reportMatch([2, 3, false]);
    expect(bracket.matchIsValid(m1)).toBe(true);
    bracket.pushMatch(m1);
    bracket.reportMatch([m1[0], m1[1], true]);
    // These participants already played their match; the same match won't be valid again.
    expect(bracket.matchIsValid(m1)).toBe(false);
  });

  test("finalize throws when participant count is not power of 2", () => {
    bracket.participants.push({ name: "New guy" });
    expect(() => bracket.finalize()).toThrowErrorMatchingInlineSnapshot(
      `"Number of participants must be a power of 2. (Current count: 9. Add 7 more.)"`
    );
  });

  test("finalize succeeds with a well-formed bracket", () => {
    bracket.finalize();
    const diff = Math.abs(Date.now() - bracket.finalizedAt?.getTime()!);
    expect(diff).toBeLessThanOrEqual(50);
  });

  test("finalize doesn't actually do anything when validateOnly is true", () => {
    bracket.finalize(true);
    expect(bracket.finalizedAt).toBeNull();
  });
});
