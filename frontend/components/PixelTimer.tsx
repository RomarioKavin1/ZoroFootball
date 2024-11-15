import React, { useState, useEffect } from "react";

interface PixelTimerProps {
  duration?: number;
  onComplete?: () => void;
}

const PixelTimer: React.FC<PixelTimerProps> = ({
  duration = 30,
  onComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(true);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      // Set warning state when 10 seconds or less remain
      if (timeLeft <= 10) {
        setIsWarning(true);
      }
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (onComplete) onComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  const formatTime = (time: number): string => {
    return `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(
      time % 60
    ).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative p-4 ${isWarning ? "animate-pulse" : ""}`}>
        {/* Outer frame */}
        <div
          className={`absolute inset-0 shadow-lg transition-colors duration-300 ${
            isWarning ? "bg-red-700" : "bg-purple-900"
          }`}
          style={{
            clipPath: `polygon(
              0 4px, 4px 4px, 4px 0,
              calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px,
              100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%,
              4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px)
            )`,
          }}
        />

        {/* Inner frame */}
        <div
          className={`relative p-4 transition-colors duration-300 ${
            isWarning ? "bg-red-600" : "bg-purple-800"
          }`}
          style={{
            clipPath: `polygon(
              0 2px, 2px 2px, 2px 0,
              calc(100% - 2px) 0, calc(100% - 2px) 2px, 100% 2px,
              100% calc(100% - 2px), calc(100% - 2px) calc(100% - 2px), calc(100% - 2px) 100%,
              2px 100%, 2px calc(100% - 2px), 0 calc(100% - 2px)
            )`,
          }}
        >
          {/* Timer display */}
          <div
            className={`font-mono text-4xl tracking-wider transition-colors duration-300 ${
              isWarning ? "text-red-100" : "text-purple-200"
            }`}
            style={{
              textShadow: `
                2px 2px 0 ${isWarning ? "#991B1B" : "#2D1657"},
                -2px -2px 0 ${isWarning ? "#991B1B" : "#2D1657"},
                2px -2px 0 ${isWarning ? "#991B1B" : "#2D1657"},
                -2px 2px 0 ${isWarning ? "#991B1B" : "#2D1657"}
              `,
            }}
          >
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixelTimer;
