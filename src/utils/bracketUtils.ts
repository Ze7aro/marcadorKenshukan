import { Competidor, Match } from "@/types";

export const generateBracket = (
  players: (Competidor | string)[],
): Match[][] => {
  const numPlayers = players.length;

  if (numPlayers < 2) {
    return [];
  }

  const rounds: Match[][] = [];
  let currentPlayers = [...players];

  if (numPlayers > 2 && numPlayers % 2 !== 0) {
    const closestPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(numPlayers)));
    const byes = closestPowerOfTwo - numPlayers;

    currentPlayers = [...currentPlayers, ...Array(byes).fill("--")];
  }

  let roundPlayers = [...currentPlayers];

  while (roundPlayers.length > 1) {
    const roundMatches: Match[] = [];

    for (let i = 0; i < roundPlayers.length; i += 2) {
      roundMatches.push({
        pair: [roundPlayers[i], roundPlayers[i + 1]],
        winner: null,
      });
    }
    rounds.push(roundMatches);
    roundPlayers = roundMatches.map(() => "--");
  }

  return rounds;
};
