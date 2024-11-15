import React from "react";

interface GameOverScreenProps {
  winner: "player1" | "player2";
  onRestart: () => void;
}

const GameOverScreen = ({ winner, onRestart }: GameOverScreenProps) => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative px-24 py-16 bg-purple-900/80">
        {/* Pixel art border */}
        <div
          className="absolute inset-0 bg-purple-600"
          style={{
            clipPath: `polygon(
              0 4px, 4px 4px, 4px 0,
              calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px,
              100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%,
              4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px)
            )`,
          }}
        />

        <div className="relative flex flex-col items-center">
          <h1 className="text-6xl mb-8 text-center">
            {winner === "player1" ? (
              <span className="text-green-400">YOU WIN!</span>
            ) : (
              <span className="text-red-400">GAME OVER</span>
            )}
          </h1>

          <button onClick={onRestart} className="relative group mt-8">
            <div
              className={`
                absolute inset-0 bg-purple-600
                transition-all duration-200
                group-hover:bg-purple-500
                group-active:bg-purple-700
              `}
              style={{
                clipPath: `polygon(
                  0 4px, 4px 4px, 4px 0,
                  calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px,
                  100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%,
                  4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px)
                )`,
              }}
            />
            <span
              className={`
              relative block px-12 py-4
              text-xl text-white
              tracking-wider
              transition-all duration-200
              group-hover:transform
              group-hover:-translate-y-1
              group-active:translate-y-0.5
            `}
            >
              PLAY AGAIN
            </span>
          </button>
        </div>
      </div>

      {/* Decorative floating pixels */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-purple-500/30 animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
};

export default GameOverScreen;
