import { useEffect, useState } from "react";
import { useDynamicContext, DynamicWidget } from "@dynamic-labs/sdk-react-core";

const LandingScreen = ({ onStart }: { onStart: () => void }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hover, setHover] = useState(false);
  const { primaryWallet } = useDynamicContext();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const CustomConnectButton = () => (
    <button
      className={`
        relative group
        transform transition-all duration-700 ease-out
        ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}
      `}
      style={{ transitionDelay: "0.2s" }}
    >
      {/* Background with pixel corners */}
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

      {/* Border Glow Effect */}
      <div
        className="absolute inset-0 opacity-50 group-hover:opacity-75 transition-opacity"
        style={{
          background:
            "linear-gradient(45deg, rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.4))",
          clipPath: `polygon(
            0 4px, 4px 4px, 4px 0,
            calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px,
            100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%,
            4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px)
          )`,
        }}
      />

      {/* Pixel Border */}
      <div
        className="absolute inset-1 pointer-events-none"
        style={{
          border: "2px solid rgba(168, 85, 247, 0.3)",
          clipPath: `polygon(
            0 2px, 2px 2px, 2px 0,
            calc(100% - 2px) 0, calc(100% - 2px) 2px, 100% 2px,
            100% calc(100% - 2px), calc(100% - 2px) calc(100% - 2px), calc(100% - 2px) 100%,
            2px 100%, 2px calc(100% - 2px), 0 calc(100% - 2px)
          )`,
        }}
      />

      {/* Button Text */}
      <span
        className={`
          relative block px-8 py-4
          text-xl font-bold 
          text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-purple-100
          tracking-wider
          transition-all duration-200
          group-hover:transform
          group-hover:-translate-y-1
          group-active:translate-y-0.5
        `}
      >
        {primaryWallet ? "DISCONNECT" : "CONNECT WALLET"}
      </span>

      {/* Pixel Corner Decorations */}
      <div className="absolute w-1 h-1 bg-purple-400 top-1 left-1" />
      <div className="absolute w-1 h-1 bg-purple-400 top-1 right-1" />
      <div className="absolute w-1 h-1 bg-purple-400 bottom-1 left-1" />
      <div className="absolute w-1 h-1 bg-purple-400 bottom-1 right-1" />
    </button>
  );
  return (
    <div className="absolute inset-0 bg-slate-900 overflow-hidden">
      {/* Animated pixel art background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-500 rounded-none animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main content container */}
      <div className="relative h-full flex flex-col items-center justify-center gap-8">
        {/* Title container */}
        <div
          className={`
              transform transition-all duration-1000 ease-out
              ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-20 opacity-0"
              }
            `}
        >
          <div className="relative p-1">
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
            <h1 className="relative px-16 py-8 text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r bg-purple-300">
              BLOCKS &<span className="block text-center">BALLS</span>
            </h1>
          </div>
        </div>

        {/* Start button */}
        <div className="flex flex-col items-center gap-6">
          {/* Dynamic Widget with Custom Button */}
          <div
            className={`
              transform transition-all duration-700 ease-out
              ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }
            `}
            style={{ transitionDelay: "0.2s" }}
          >
            <DynamicWidget innerButtonComponent={<CustomConnectButton />} />
          </div>

          {/* Start Button - only show when connected */}
          {primaryWallet && (
            <button
              onClick={onStart}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              className={`
                relative group
                transform transition-all duration-700 ease-out
                ${
                  isLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-20 opacity-0"
                }
              `}
              style={{ transitionDelay: "0.3s" }}
            >
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
                  relative block px-12 py-6
                  text-2xl font-bold text-white
                  tracking-wider
                  transition-all duration-200
                  group-hover:transform
                  group-hover:-translate-y-1
                  group-active:translate-y-0.5
                `}
              >
                PRESS START
              </span>
              <div
                className={`
                  absolute -right-8 top-1/2 -translate-y-1/2
                  transition-all duration-300
                  ${
                    hover
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4"
                  }
                `}
              >
                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent" />
              </div>
            </button>
          )}
        </div>
        <div
          className={`
            absolute inset-0 pointer-events-none
            transition-all duration-1000 ease-out
            ${isLoaded ? "opacity-100" : "opacity-0"}
          `}
        >
          {/* Left card */}
          <div className="absolute top-1/4 left-20 animate-float-slow transform -rotate-12">
            <div className="w-32 h-48 bg-purple-500/20 rounded-lg border-2 border-purple-500/30">
              <div className="absolute inset-2 border border-purple-400/30" />
            </div>
          </div>

          {/* Right card */}
          <div className="absolute bottom-1/4 right-20 animate-float-slower transform rotate-12">
            <div className="w-32 h-48 bg-purple-500/20 rounded-lg border-2 border-purple-500/30">
              <div className="absolute inset-2 border border-purple-400/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LandingScreen;
