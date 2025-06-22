import React from "react";

interface Competidor {
  id: number;
  Nombre: string;
  Edad: number;
}

interface Match {
  pair: (Competidor | string)[];
  winner: Competidor | string | null;
}

interface BracketProps {
  competidores: Competidor[];
}

interface MatchCardProps {
  match: Match;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => (
  <div className="border p-2 rounded-lg shadow-sm bg-white min-w-[200px]">
    {match.pair.map((player, playerIndex) => (
      <div
        key={playerIndex}
        className={`p-2 border ${
          playerIndex === 0
            ? "border-b rounded-lg bg-red-500 text-white"
            : "border-t-0 rounded-lg"
        } ${player === "BYE" ? "text-gray-400 italic" : ""}`}
      >
        {typeof player === "object" ? player.Nombre : player}
      </div>
    ))}
  </div>
);

interface RoundColumnProps {
  round: Match[];
  roundIndex: number;
}

const roundNameMapping: { [key: number]: string } = {
  2: "Final",
  4: "Semifinal",
  8: "Cuartos de Final",
  16: "Octavos de Final",
  32: "16vos de Final",
};

const RoundColumn: React.FC<RoundColumnProps> = ({ round, roundIndex }) => {
  const numPlayersInRound = round.length * 2;
  const roundTitle =
    roundNameMapping[numPlayersInRound] || `Ronda de ${numPlayersInRound}`;

  const gaps = ["2rem", "10rem", "20rem", "42rem"];

  const roundStyle: React.CSSProperties = {};
  if (roundIndex > 0) {
    roundStyle.placeSelf = "center";
  }

  const matchesStyle: React.CSSProperties = {
    gap: gaps[roundIndex] || "2rem",
  };

  return (
    <div className="flex flex-col" style={roundStyle}>
      <h3 className="text-center font-bold mb-6">{roundTitle}</h3>
      <div className="flex flex-col" style={matchesStyle}>
        {round.map((match, matchIndex) => (
          <MatchCard key={matchIndex} match={match} />
        ))}
      </div>
    </div>
  );
};

const Bracket: React.FC<BracketProps> = ({ competidores }) => {
  const generateBracket = (players: (Competidor | string)[]) => {
    const numPlayers = players.length;

    if (numPlayers < 2) {
      return [];
    }

    const rounds: Match[][] = [];
    let currentPlayers = [...players];

    if (numPlayers > 2 && numPlayers % 2 !== 0) {
      const closestPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(numPlayers)));
      const byes = closestPowerOfTwo - numPlayers;

      currentPlayers = [...currentPlayers, ...Array(byes).fill("BYE")];
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
      roundPlayers = roundMatches.map(() => "Winner");
    }

    return rounds;
  };

  const bracketData = generateBracket(competidores);

  if (bracketData.length === 0) {
    return (
      <div className="flex justify-center items-center p-4 text-gray-500">
        No hay suficientes competidores para generar las llaves.
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto gap-4 justify-center">
      {/*       <div className="border rounded-lg shadow-sm text-white bg-zinc-700 min-w-[200px] h-20 flex flex-col justify-center items-center">
        <div className={"p-2 border-b w-full text-center text-red-500 italic"}>
          AKA
        </div>
        <div className={"p-2 w-full text-center text-white italic"}>SHIRO</div>
      </div> */}
      <div className="flex items-start space-x-8">
        {bracketData.map((round, roundIndex) => (
          <RoundColumn key={roundIndex} round={round} roundIndex={roundIndex} />
        ))}
      </div>
    </div>
  );
};

export default Bracket;
