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

  test("countMatches", () => {
    const matches: model.Match[] = [
      [0, 1],
      [3, 2],
      [0, 3],
    ];
    bracket.matches = matches;
    expect(bracket.countMatches(0, 1, 2, 3)).toMatchInlineSnapshot(`
      Array [
        2,
        1,
        1,
        2,
      ]
    `);
  });

  test("countAllMatches", () => {
    const matches: model.Match[] = [
      [1, 0],
      [2, 3],
      [1, 2],
    ];
    bracket.matches = matches;
    expect(bracket.countAllMatches()).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        2,
        1,
        0,
        0,
        0,
        0,
      ]
    `);
  });

  test("findMatch", () => {
    const matches: model.Match[] = [
      [1, 0],
      [2, 3],
      [1, 2],
    ];
    bracket.matches = matches;
    expect(bracket.findMatch(2, 1)).toBe(2);
    expect(bracket.findMatch(3, 2)).toBe(1);
    expect(bracket.findMatch(2, 3)).toBe(1);
    expect(bracket.findMatch(1, 3)).toBe(-1);
  });

  test("computeTotalRounds", () => {
    expect(bracket.computeTotalRounds()).toBe(3);
    bracket.participants.push(...bracket.participants);
    // Double the participant count => one more round.
    expect(bracket.computeTotalRounds()).toBe(4);
    bracket.participants.push(...bracket.participants);
    expect(bracket.computeTotalRounds()).toBe(5);
  });

  test("computeMatchRound throws with bad arguments", () => {
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

  test("matchIsValid", () => {
    const m1: model.Match = [0, 2];
    // These participants don't meet before they've played 1 round each.
    expect(bracket.matchIsValid(m1)).toBe(false);
    bracket.matches.push([0, 1]);
    bracket.matches.push([2, 3]);
    expect(bracket.matchIsValid(m1)).toBe(true);
    bracket.matches.push(m1);
    // These participants already played their match; the same match won't be valid.
    expect(bracket.matchIsValid(m1)).toBe(false);
  });
});
