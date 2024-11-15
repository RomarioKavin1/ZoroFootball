import React from "react";

interface PlayerLifeProps {
  player1Life: number;
  maxLife?: number;
  theme?: "classic" | "neon" | "retro" | "pastel" | "cyber";
}

const lifeThemes = {
  classic: {
    filled: "brightness-100 saturate-100",
    empty: "brightness-50 saturate-0",
    container: "bg-slate-800",
    border: "border-slate-700",
  },
  neon: {
    filled: "brightness-110 saturate-150 hue-rotate-320",
    empty: "brightness-50 saturate-50 hue-rotate-320",
    container: "bg-slate-900",
    border: "border-purple-900",
  },
  retro: {
    filled: "brightness-100 saturate-100 hue-rotate-[-10deg]",
    empty: "brightness-50 saturate-50 hue-rotate-[-10deg]",
    container: "bg-slate-800",
    border: "border-orange-900",
  },
  pastel: {
    filled: "brightness-110 saturate-75 hue-rotate-320",
    empty: "brightness-50 saturate-50",
    container: "bg-slate-900",
    border: "border-rose-900",
  },
  cyber: {
    filled: "brightness-110 saturate-150 hue-rotate-90",
    empty: "brightness-50 saturate-50 hue-rotate-90",
    container: "bg-slate-900",
    border: "border-emerald-900",
  },
};

const PlayerLife: React.FC<PlayerLifeProps> = ({
  player1Life,
  maxLife = 3,
  theme = "neon",
}) => {
  const scheme = lifeThemes[theme];

  return (
    <div
      className={`
      inline-flex
      relative
      p-3
      ${scheme.container}
      border-2
      ${scheme.border}
      shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]
      transform
      transition-transform
      duration-200
      hover:translate-x-[-2px]
      hover:translate-y-[-2px]
      hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]
    `}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(45deg, black 25%, transparent 25%), 
                           linear-gradient(-45deg, black 25%, transparent 25%), 
                           linear-gradient(45deg, transparent 75%, black 75%), 
                           linear-gradient(-45deg, transparent 75%, black 75%)`,
          backgroundSize: "4px 4px",
          backgroundPosition: "0 0, 0 2px, 2px -2px, -2px 0px",
        }}
      />

      {/* Inner glow effect */}
      <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white via-transparent to-transparent" />

      {/* Hearts container */}
      <div className="flex space-x-3 relative">
        {Array(maxLife)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className={`
                relative 
                transform 
                transition-all 
                duration-300 
                ${index < player1Life ? "scale-100" : "scale-90 opacity-50"}
              `}
            >
              {/* Shadow image */}
              <div className="absolute inset-0 transform translate-x-[2px] translate-y-[2px]">
                <img
                  src="/heart.png"
                  alt="heart shadow"
                  className="w-8 h-8 brightness-0 opacity-30"
                />
              </div>

              {/* Main heart image */}
              <img
                src="/heart.png"
                alt="heart"
                className={`
                  relative 
                  w-8 h-8
                  ${index < player1Life ? scheme.filled : scheme.empty}
                  transition-all
                  duration-300
                  image-rendering-pixelated
                `}
              />

              {/* Highlight overlay */}
              <div
                className={`
                  absolute 
                  inset-0 
                  bg-white/20
                  ${index < player1Life ? "opacity-30" : "opacity-0"}
                `}
                style={{
                  clipPath: "polygon(0 0, 50% 0, 0 50%)",
                }}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default PlayerLife;
