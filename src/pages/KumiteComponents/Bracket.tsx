import React from "react";
import { Card, CardBody } from "@heroui/react";

import { Match } from "@/types";

interface BracketProps {
  bracket: Match[][];
}

interface MatchCardProps {
  match: Match;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  return (
    <Card className="border p-2 rounded-lg shadow-sm bg-white min-w-[200px]">
      <CardBody className="p-0">
        {match.pair.map((competitor, competitorIndex) => {
          let displayName: string;
          let isWinner = false;

          if (
            typeof competitor === "object" &&
            competitor !== null &&
            "Nombre" in competitor
          ) {
            displayName = (competitor as any).Nombre;
            if (
              match.winner &&
              typeof match.winner === "object" &&
              match.winner !== null &&
              "id" in match.winner
            ) {
              isWinner = (match.winner as any).id === (competitor as any).id;
            }
          } else {
            displayName = competitor as string;
          }

          // Determinar si hay un ganador y si este competidor es el perdedor
          const hayGanador = !!match.winner;
          const esPerdedor = hayGanador && !isWinner && displayName !== "--";

          return (
            <div
              key={competitorIndex}
              className={`p-2 ${
                competitorIndex === 0
                  ? "rounded-t-lg border-b-2 bg-red-500 text-white border-gray-200"
                  : "rounded-b-lg bg-white text-black"
              } ${esPerdedor ? "line-through" : ""}`}
            >
              {displayName || "--"}
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
};

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

const Bracket: React.FC<BracketProps> = ({ bracket }) => {
  if (bracket.length === 0) {
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
        {bracket.map((round, roundIndex) => (
          <RoundColumn key={roundIndex} round={round} roundIndex={roundIndex} />
        ))}
      </div>
    </div>
  );
};

export default Bracket;
