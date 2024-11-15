import React from "react";
import PlayerCard from "./CardContainer";

interface PlayerCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: () => void;
  player: {
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
  };
  type: "left" | "right";
}

const PlayerCardModal: React.FC<PlayerCardModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  player,
  type,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-slate-900 border-2 border-purple-500 p-8 max-w-2xl w-fit px-20 mx-4 transform transition-all">
        {/* Pixel art corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-300" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-300" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-300" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-300" />

        {/* Content */}
        <div className="flex flex-col items-center mt-10">
          {/* Card Display */}
          <div className="transform scale-125">
            <PlayerCard {...player} type={type} />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={onClose}
              className={`
                px-6 py-2
                bg-gray-800
                text-gray-200
                border-2 border-gray-700
                hover:bg-gray-700
                transition-colors
                duration-200
                transform hover:-translate-y-0.5
                shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]
                active:shadow-[0px_0px_0px_0px_rgba(0,0,0,0.5)]
                active:transform
                active:translate-y-0.5
              `}
            >
              Cancel
            </button>
            <button
              onClick={onSelect}
              className={`
                px-6 py-2
                bg-purple-600
                text-white
                border-2 border-purple-500
                hover:bg-purple-500
                transition-colors
                duration-200
                transform hover:-translate-y-0.5
                shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]
                active:shadow-[0px_0px_0px_0px_rgba(0,0,0,0.5)]
                active:transform
                active:translate-y-0.5
              `}
            >
              Play Card
            </button>
          </div>
        </div>

        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(45deg, black 25%, transparent 25%),
                             linear-gradient(-45deg, black 25%, transparent 25%),
                             linear-gradient(45deg, transparent 75%, black 75%),
                             linear-gradient(-45deg, transparent 75%, black 75%)`,
            backgroundSize: "4px 4px",
            backgroundPosition: "0 0, 0 2px, 2px -2px, -2px 0px",
          }}
        />
      </div>
    </div>
  );
};

export default PlayerCardModal;
