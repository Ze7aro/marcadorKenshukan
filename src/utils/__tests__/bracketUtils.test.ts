import { generateBracket } from "../bracketUtils";
import { describe, it, expect } from "vitest";

describe("generateBracket Utility", () => {
  it("should return empty array for less than 2 players", () => {
    expect(generateBracket([])).toEqual([]);
    expect(generateBracket(["Player 1"])).toEqual([]);
  });

  it("should generate 1 round for 2 players", () => {
    // Round 1 (Final): 1 match
    const players = ["P1", "P2"];
    const bracket = generateBracket(players);
    expect(bracket.length).toBe(1);
    expect(bracket[0].length).toBe(1);
    expect(bracket[0][0].pair).toEqual(["P1", "P2"]);
  });

  it("should generate 2 rounds for 4 players", () => {
    // Round 1 (Semis): 2 matches
    // Round 2 (Final): 1 match
    const players = ["P1", "P2", "P3", "P4"];
    const bracket = generateBracket(players);
    expect(bracket.length).toBe(2);
    expect(bracket[0].length).toBe(2); // Semis
    expect(bracket[1].length).toBe(1); // Final
  });

  it("should generate 3 rounds for 8 players", () => {
    // Round 1 (Quarters): 4 matches
    const players = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8"];
    const bracket = generateBracket(players);
    expect(bracket.length).toBe(3);
    expect(bracket[0].length).toBe(4);
    expect(bracket[2].length).toBe(1);
  });

  it("should handle odd number of players (3) with BYEs", () => {
    // 3 players -> next power of 2 is 4 -> 1 BYE
    // Players: P1, P2, P3, BYE
    const players = ["P1", "P2", "P3"];
    const bracket = generateBracket(players);

    // Expect 2 rounds (Semis + Final)
    expect(bracket.length).toBe(2);

    // Check first round pairing
    // P1 vs P2
    // P3 vs -- (BYE)
    const round1 = bracket[0];
    expect(round1.length).toBe(2);
    expect(round1[0].pair).toEqual(["P1", "P2"]);
    expect(round1[1].pair).toEqual(["P3", "--"]);
  });

  it("should handle 5 players with BYEs", () => {
    // 5 players -> next power of 2 is 8 -> 3 BYEs
    const players = ["P1", "P2", "P3", "P4", "P5"];
    const bracket = generateBracket(players);

    // Expect 3 rounds (Quarters, Semis, Final)
    expect(bracket.length).toBe(3);

    // Round 1 should have 4 matches (8 slots)
    // Matches: P1-P2, P3-P4, P5-BYE, BYE-BYE
    // Wait, let's check logic:
    // P1, P2, P3, P4, P5, --, --, --
    // Pairs: (P1, P2), (P3, P4), (P5, --), (--, --)
    const round1 = bracket[0];
    expect(round1.length).toBe(4);
    expect(round1[2].pair).toEqual(["P5", "--"]);
    expect(round1[3].pair).toEqual(["--", "--"]);
  });
});
