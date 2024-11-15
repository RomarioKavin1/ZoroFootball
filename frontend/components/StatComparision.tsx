import { useEffect, useRef, useState } from "react";

interface PlayerCard {
  id: number;
  name: string;
  position: string;
  rating: number;
  club: string;
  nationality: string;
  stats: {
    pace: number;
    attack: number;
    passing: number;
    dribbling: number;
    defence: number;
    physical: number;
  };
}

type ComparisonResult = {
  winner: "player1" | "player2" | "draw";
  comparisons: ComparisonItem[];
};

type ComparisonItem = {
  type: string;
  player1: number;
  player2: number;
  isActive: boolean;
  result: "player1" | "player2" | "draw" | "pending";
};

const StatComparisonOverlay = ({
  show,
  player1Card,
  player2Card,
  onComplete,
}: {
  show: boolean;
  player1Card: PlayerCard;
  player2Card: PlayerCard;
  onComplete: (result: ComparisonResult) => void;
}) => {
  const [comparisons, setComparisons] = useState<ComparisonItem[]>([]);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (show && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      const compareStats = async () => {
        // Attack vs Defense
        const newComparisons: ComparisonItem[] = [
          {
            type: "Attack vs Defense",
            player1: player1Card.stats.attack,
            player2: player2Card.stats.defence,
            isActive: true,
            result: "pending",
          },
        ];
        setComparisons(newComparisons);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (player1Card.stats.attack > player2Card.stats.defence) {
          newComparisons[0].result = "player1";
          setComparisons([...newComparisons]);
          setTimeout(
            () =>
              onComplete({
                winner: "player1",
                comparisons: newComparisons,
              }),
            1500
          );
          return;
        }

        if (player1Card.stats.attack < player2Card.stats.defence) {
          newComparisons[0].result = "player2";
          setComparisons([...newComparisons]);
          setTimeout(
            () =>
              onComplete({
                winner: "player2",
                comparisons: newComparisons,
              }),
            1500
          );
          return;
        }

        // If equal, check Pace vs Passing
        newComparisons[0].result = "draw";
        newComparisons.push({
          type: "Pace vs Passing",
          player1: player1Card.stats.pace,
          player2: player2Card.stats.passing,
          isActive: true,
          result: "pending",
        });
        setComparisons([...newComparisons]);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (player1Card.stats.pace > player2Card.stats.passing) {
          newComparisons[1].result = "player1";
          setComparisons([...newComparisons]);
          setTimeout(
            () =>
              onComplete({
                winner: "player1",
                comparisons: newComparisons,
              }),
            1500
          );
          return;
        }

        if (player1Card.stats.pace < player2Card.stats.passing) {
          newComparisons[1].result = "player2";
          setComparisons([...newComparisons]);
          setTimeout(
            () =>
              onComplete({
                winner: "player2",
                comparisons: newComparisons,
              }),
            1500
          );
          return;
        }

        // If still equal, check Passing vs Pace
        newComparisons[1].result = "draw";
        newComparisons.push({
          type: "Passing vs Pace",
          player1: player1Card.stats.passing,
          player2: player2Card.stats.pace,
          isActive: true,
          result: "pending",
        });
        setComparisons([...newComparisons]);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (player1Card.stats.passing > player2Card.stats.pace) {
          newComparisons[2].result = "player1";
          setComparisons([...newComparisons]);
          setTimeout(
            () =>
              onComplete({
                winner: "player1",
                comparisons: newComparisons,
              }),
            1500
          );
          return;
        }

        if (player1Card.stats.passing < player2Card.stats.pace) {
          newComparisons[2].result = "player2";
          setComparisons([...newComparisons]);
          setTimeout(
            () =>
              onComplete({
                winner: "player2",
                comparisons: newComparisons,
              }),
            1500
          );
          return;
        }

        // If everything is equal, it's a draw
        newComparisons[2].result = "draw";
        setComparisons([...newComparisons]);
        setTimeout(
          () =>
            onComplete({
              winner: "draw",
              comparisons: newComparisons,
            }),
          1500
        );
      };

      compareStats();
    }
    return () => {
      hasCompletedRef.current = false;
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative bg-purple-900/90 border-4 border-white/20 p-8 max-w-2xl w-full transform scale-90">
        {/* Pixel corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white/40" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white/40" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white/40" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white/40" />

        <div className="space-y-8">
          {comparisons.map((comparison) => (
            <div
              key={comparison.type}
              className={`
                transition-all duration-500 transform
                ${
                  comparison.isActive
                    ? "opacity-100 scale-100"
                    : "opacity-40 scale-95"
                }
                ${
                  comparison.result !== "pending"
                    ? "translate-y-0"
                    : "translate-y-4"
                }
              `}
            >
              <div className="flex items-center justify-between gap-8 px-8">
                <div className="flex-1 text-right">
                  <div
                    className={`
                      text-3xl font-mono mb-2 transition-colors duration-300
                      ${
                        comparison.result === "player1"
                          ? "text-green-400"
                          : comparison.result === "player2"
                          ? "text-red-400"
                          : "text-white"
                      }
                    `}
                  >
                    {comparison.player1}
                  </div>
                </div>

                <div className="flex flex-col items-center px-4">
                  <div className="text-white/80 font-mono text-sm mb-1">
                    {comparison.type}
                  </div>
                  <div
                    className={`h-1 w-full bg-white/20 transition-all duration-1000
                      ${comparison.result !== "pending" ? "w-48" : "w-24"}
                    `}
                  >
                    <div
                      className={`
                        h-full transition-all duration-1000
                        ${
                          comparison.result === "player1"
                            ? "bg-green-500 w-full"
                            : comparison.result === "player2"
                            ? "bg-red-500 w-full"
                            : comparison.result === "draw"
                            ? "bg-yellow-500 w-1/2"
                            : "w-0"
                        }
                      `}
                    />
                  </div>
                </div>

                <div className="flex-1 text-left">
                  <div
                    className={`
                      text-3xl font-mono mb-2 transition-colors duration-300
                      ${
                        comparison.result === "player2"
                          ? "text-green-400"
                          : comparison.result === "player1"
                          ? "text-red-400"
                          : "text-white"
                      }
                    `}
                  >
                    {comparison.player2}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatComparisonOverlay;
