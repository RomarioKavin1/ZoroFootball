"use client";
import { useEffect, useState } from "react";
import PlayerLife from "@/components/PlayerLife";
import PlayerCard from "@/components/CardContainer";
import PlayerCardModal from "@/components/CardModal";
import { player1, player2, player3, player4, player5 } from "@/util/constants";
import PixelTimer from "@/components/PixelTimer";
import StatComparisonOverlay from "@/components/StatComparision";
import VsScreen from "@/components/VsScreen";
import LandingScreen from "@/components/LandingScreen";
import GameOverScreen from "@/components/GameOver";

interface PlayerCard {
  name: string;
  position: string;
  rating: number;
  id: number;
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

export default function Home() {
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showVsScreen, setShowVsScreen] = useState(false);
  const [player1Life, setplayer1Life] = useState(3);
  const [player2Life, setplayer2Life] = useState(3);
  const [selectedCard, setSelectedCard] = useState<PlayerCard | null>(null);
  const [roundMessage, setRoundMessage] = useState<string>("");
  const [showGameWon, setShowGameWon] = useState(false);
  const [player1SelectedCard, setPlayer1SelectedCard] =
    useState<PlayerCard | null>(null);
  const [player2SelectedCard, setPlayer2SelectedCard] =
    useState<PlayerCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [showTimer, setShowTimer] = useState(false);
  const [roundActive, setRoundActive] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [roundResult, setRoundResult] = useState<ComparisonResult | null>(null);
  const [availableSlots, setAvailableSlots] = useState<(PlayerCard | null)[]>([
    player4,
    player4,
    player5,
    player1,
    player2,
    player3,
    player1,
  ]);

  const [deckCount, setDeckCount] = useState(7);
  const [showPlayer2Selection, setShowPlayer2Selection] = useState(false);
  const [isSelectionPhase, setIsSelectionPhase] = useState(true);
  const DrawButton = ({
    onClick,
    disabled,
  }: {
    onClick: () => void;
    disabled: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 
        py-2 
        ${
          disabled
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-500 active:bg-purple-700"
        }
        text-white 
        font-mono 
        rounded-sm 
        transition-all 
        duration-200 
        border-2 
        border-purple-400
        disabled:border-gray-400
        disabled:opacity-50
      `}
    >
      Draw Card
    </button>
  );

  const handleDrawCard = () => {
    // Find first empty slot
    const emptySlotIndex = availableSlots.findIndex((slot) => slot === null);
    if (emptySlotIndex === -1) return; // No empty slots

    const newCard = getRandomCard();
    const newSlots = [...availableSlots];
    newSlots[emptySlotIndex] = newCard;
    setAvailableSlots(newSlots);
  };

  const playCard = () => {
    if (!player1SelectedCard || !isSelectionPhase) return;

    setShowTimer(false);
    setRoundActive(false);
    setIsSelectionPhase(false);
    setShowPlayer2Selection(true);

    // Remove the played card from available slots when it's played
    const playedCardIndex = availableSlots.findIndex(
      (card) => card?.id === player1SelectedCard.id
    );
    if (playedCardIndex !== -1) {
      const newSlots = [...availableSlots];
      newSlots[playedCardIndex] = null;
      setAvailableSlots(newSlots);
    }

    const player2Card = getRandomCard();

    setTimeout(() => {
      setPlayer2SelectedCard(player2Card);

      setTimeout(() => {
        setShowPlayer2Selection(false);
        setShowVsScreen(true);

        setTimeout(() => {
          setShowVsScreen(false);
          setShowComparison(true);
        }, 3000);
      }, 2000);
    }, 2000);
  };
  useEffect(() => {
    if (player1Life <= 0) {
      setGameOver(true);
      setShowGameWon(false); // Player lost
    } else if (player2Life <= 0) {
      setGameOver(true);
      setShowGameWon(true); // Player won
    }
  }, [player1Life, player2Life]);
  const getRandomCard = () => {
    const randomIndex = Math.floor(Math.random() * availableSlots.length);
    return availableSlots[randomIndex];
  };

  const handleTimerComplete = () => {
    setShowTimer(false);
    setRoundActive(false);
    setIsSelectionPhase(false);

    if (!player1SelectedCard) {
      setplayer1Life((prev) => Math.max(0, prev - 1));
      startNewRound();
      return;
    }

    setShowPlayer2Selection(true);

    setTimeout(() => {
      const player2Card = getRandomCard();
      setPlayer2SelectedCard(player2Card);

      setTimeout(() => {
        setShowPlayer2Selection(false);
        setShowComparison(true);
      }, 1500);
    }, 2000);
  };
  const handleRestart = () => {
    setGameOver(false);
    setGameStarted(false);
    setplayer1Life(3);
    setplayer2Life(3);
    setPlayer1SelectedCard(null);
    setPlayer2SelectedCard(null);
    setCurrentPlayer(1);
    setShowTimer(false);
    setRoundActive(true);
    setShowComparison(false);
    setRoundResult(null);
    setAvailableSlots([
      player1,
      player2,
      player3,
      player4,
      player5,
      player1,
      player2,
    ]);
    setDeckCount(7);
  };

  const handleComparisonComplete = (result: ComparisonResult) => {
    setRoundResult(result);
    setShowComparison(false);

    if (result.winner === "player2") {
      setplayer1Life((prev) => Math.max(0, prev - 1));
      setRoundMessage("Round Lost!");
    } else if (result.winner === "player1") {
      setplayer2Life((prev) => Math.max(0, prev - 1));
      setRoundMessage("Round Won!");
    } else {
      setRoundMessage("Draw!");
    }

    setTimeout(() => {
      setRoundResult(null);
      setRoundMessage("");
      startNewRound();
    }, 2000);
  };

  const handleCardClick = (player: PlayerCard | null) => {
    if (currentPlayer === 1) {
      setSelectedCard(player);
      setIsModalOpen(true);
    }
  };

  const startNewRound = () => {
    setPlayer1SelectedCard(null);
    setPlayer2SelectedCard(null);
    setCurrentPlayer(1);
    setShowTimer(true);
    setRoundActive(true);
    setIsSelectionPhase(true);
    setShowPlayer2Selection(false);
    console.log(showPlayer2Selection);
    setShowComparison(false);
    setRoundResult(null);
  };

  useEffect(() => {
    if (gameStarted) {
      startNewRound();
    }
  }, [gameStarted]);

  const handleCardSelect = () => {
    setPlayer1SelectedCard(selectedCard);
    setSelectedCard(null);
    setIsModalOpen(false);
  };

  const EmptySlotPlayer1 = () => (
    <div
      className={`
        w-64 h-96 
        border-4 border-dashed
        border-purple-500/30
        rounded-xl
        flex flex-col items-center justify-center
        gap-4
        bg-black/20
        backdrop-blur-sm
        transition-all
        duration-200
        hover:bg-black/30
        hover:border-purple-500/50
        group
      `}
    >
      <span className="text-purple-500/50 group-hover:text-purple-500/70 transition-colors duration-200">
        Empty Slot
      </span>
      <DrawButton
        onClick={handleDrawCard}
        disabled={deckCount <= 0 || !isSelectionPhase}
      />
    </div>
  );

  const EmptySlotPlayer2 = () => (
    <div
      className={`
        w-64 h-96 
        border-4 border-dashed
        border-purple-500/30
        rounded-xl
        flex items-center justify-center
        bg-black/20
        backdrop-blur-sm
      `}
    >
      <span className="text-purple-500/50">Empty Slot</span>
    </div>
  );

  return (
    <div className="flex justify-center items-center">
      <div className="relative w-[1472px] h-[832px] rounded-lg overflow-hidden border-4 border-purple-500 mt-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/pitchbg2.jpeg')",
          }}
        />
        {!gameStarted ? (
          <LandingScreen onStart={() => setGameStarted(true)} />
        ) : gameOver ? (
          <GameOverScreen
            winner={player1Life > 0 ? "player1" : "player2"}
            onRestart={handleRestart}
          />
        ) : (
          <>
            <div className="absolute top-16 right-16 p-2 text-white rounded scale-125">
              <PlayerLife player1Life={player2Life} />
            </div>
            <div className="absolute top-16 left-16 p-2 text-white rounded scale-125">
              <PlayerLife player1Life={player1Life} />
            </div>

            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-12">
              <div className="transform -rotate-12">
                {player1SelectedCard ? (
                  <div className="relative">
                    <PlayerCard {...player1SelectedCard} type="left" />
                    {isSelectionPhase && (
                      <button
                        onClick={playCard}
                        className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-mono rounded-sm transition-all duration-200 border-2 border-purple-400"
                      >
                        Play Card
                      </button>
                    )}
                  </div>
                ) : (
                  <EmptySlotPlayer1 />
                )}
                <div className="text-center mt-4 text-white/70 text-sm">
                  Player 1
                </div>
              </div>

              {showTimer && roundActive && (
                <div className="transform scale-75 z-50">
                  <PixelTimer duration={30} onComplete={handleTimerComplete} />
                </div>
              )}

              <div className="transform rotate-12">
                <div className="relative">
                  {player2SelectedCard ? (
                    <PlayerCard {...player2SelectedCard} type="right" />
                  ) : (
                    <EmptySlotPlayer2 />
                  )}
                </div>
                <div className="text-center mt-4 text-white/70 text-sm">
                  Player 2
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-56 flex space-x-4 scale-[65%]">
              {availableSlots.map((player, index) => (
                <div key={`slot-${index}`} className="relative">
                  {player ? (
                    <PlayerCard
                      {...player}
                      type="right"
                      onClick={() => handleCardClick(player)}
                    />
                  ) : (
                    <div
                      className="w-64 h-96 border-4 border-dashed border-purple-500/30 rounded-xl 
                          flex items-center justify-center bg-black/20 backdrop-blur-sm"
                    >
                      <span className="text-purple-500/50">Empty Slot</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {showComparison && player1SelectedCard && player2SelectedCard && (
          <StatComparisonOverlay
            show={showComparison}
            player1Card={player1SelectedCard}
            player2Card={player2SelectedCard}
            onComplete={handleComparisonComplete}
          />
        )}
        {selectedCard && (
          <PlayerCardModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSelect={handleCardSelect}
            player={selectedCard}
            type={currentPlayer === 1 ? "left" : "right"}
          />
        )}

        {showVsScreen &&
          player1SelectedCard != null &&
          player2SelectedCard != null && (
            <VsScreen
              player1Card={player1SelectedCard}
              player2Card={player2SelectedCard}
            />
          )}
        {roundResult && !showComparison && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="relative bg-purple-900/90 border-4 border-white/20 p-8 transform scale-90">
              <h2 className="text-4xl font-mono text-center mb-4 pixel-corners">
                {roundMessage && (
                  <span
                    className={`text-5xl font-bold ${
                      roundMessage === "Round Won!"
                        ? "text-green-400"
                        : roundMessage === "Round Lost!"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {roundMessage}
                  </span>
                )}
              </h2>
            </div>
          </div>
        )}

        {/* Add Game Won overlay */}
        {gameOver && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="relative bg-purple-900/90 border-4 border-white/20 p-8 transform scale-90">
              <h2 className="text-6xl font-mono text-center mb-4 pixel-corners">
                {showGameWon ? (
                  <span className="text-green-400">Game Won!</span>
                ) : (
                  <span className="text-red-400">Game Over!</span>
                )}
              </h2>
              <button
                onClick={handleRestart}
                className="mt-8 px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-mono rounded transition-colors duration-200"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
