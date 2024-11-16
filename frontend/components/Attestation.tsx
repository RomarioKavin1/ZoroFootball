// components/AttestationLog.tsx
import { useState } from "react";

interface PlayerData {
  id: number;
  pace: number;
  attack: number;
  passing: number;
  defence: number;
  teamFanTokenAddress: string;
  metadata: string;
}

export interface AttestationData {
  threadid: number;
  round: number;
  move: string;
  player: PlayerData | "card drawn";
  attestation: {
    deriveKey: {
      deriveKey: string;
      derive_32bytes: string;
    };
    tdxQuote: {
      quote: string;
      event_log: string;
    };
  };
}

interface AttestationLogProps {
  attestations: AttestationData[];
}

export const AttestationLog = ({ attestations }: AttestationLogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAttestation, setSelectedAttestation] =
    useState<AttestationData | null>(null);

  const renderMoveIcon = (move: string) => {
    if (move === "attack") {
      return "⚔️"; // Sword for attack
    } else if (move === "draw card") {
      return "🎴"; // Card for draw
    }
    return "❓"; // Default
  };

  return (
    <div className="fixed bottom-0 right-0 z-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 text-white px-4 py-2 rounded-t-lg font-mono hover:bg-purple-500 transition-colors flex items-center gap-2"
      >
        {isOpen ? "▼" : "▲"} Attestations
        <span className="bg-purple-700 px-2 py-0.5 rounded-full text-xs">
          {attestations.length}
        </span>
      </button>

      <div
        className={`
        bg-gray-900/95 
        border-t-2 border-l-2 border-purple-500
        w-[600px]
        transition-all duration-300 ease-in-out
        backdrop-blur-sm
        ${isOpen ? "h-[400px]" : "h-0"}
        overflow-hidden
      `}
      >
        <div className="p-4 h-full flex">
          {/* Attestation List */}
          <div className="w-1/3 border-r border-purple-500/30 pr-4 overflow-y-auto">
            {attestations.map((att, index) => (
              <div
                key={index}
                onClick={() => setSelectedAttestation(att)}
                className={`
                  p-3 mb-2 rounded cursor-pointer
                  transition-colors duration-200
                  ${
                    selectedAttestation === att
                      ? "bg-purple-500/20 border-purple-500"
                      : "bg-gray-800/50 hover:bg-gray-800"
                  }
                  border border-transparent hover:border-purple-500/50
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="text-white/90 font-semibold">
                    Round {att.round}
                  </div>
                  <div className="text-xl">{renderMoveIcon(att.move)}</div>
                </div>
                <div className="text-purple-400 text-sm">Move: {att.move}</div>
                <div className="text-gray-400 text-xs mt-1">
                  {typeof att.player === "string"
                    ? "New Card Drawn"
                    : att.player.metadata}
                </div>
              </div>
            ))}
          </div>

          {/* Attestation Details */}
          <div className="flex-1 pl-4 overflow-y-auto">
            {selectedAttestation ? (
              <div className="space-y-4">
                <div className="border-b border-purple-500/30 pb-2">
                  <h3 className="text-purple-400 font-semibold">
                    Move Details
                  </h3>
                  <div className="text-white/80 text-sm mt-1">
                    <div>Thread ID: {selectedAttestation.threadid}</div>
                    <div>Round: {selectedAttestation.round}</div>
                    <div className="flex items-center gap-2">
                      Move Type: {selectedAttestation.move}
                      <span className="text-xl">
                        {renderMoveIcon(selectedAttestation.move)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Player Details - Only show for attack moves */}
                {typeof selectedAttestation.player !== "string" && (
                  <div className="border-b border-purple-500/30 pb-2">
                    <h3 className="text-purple-400 font-semibold">Player</h3>
                    <div className="text-white/80 text-sm mt-1">
                      <div>Name: {selectedAttestation.player.metadata}</div>
                      <div>Attack: {selectedAttestation.player.attack}</div>
                      <div>
                        Contract:{" "}
                        {selectedAttestation.player.teamFanTokenAddress.slice(
                          0,
                          6
                        )}
                        ...
                        {selectedAttestation.player.teamFanTokenAddress.slice(
                          -4
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Attestation Details */}
                <div>
                  <h3 className="text-purple-400 font-semibold">Attestation</h3>
                  <div className="text-xs font-mono mt-2 space-y-2">
                    <div className="bg-black/30 p-2 rounded">
                      <div className="text-gray-400">Derive Key:</div>
                      <div className="text-white/70 break-all">
                        {
                          selectedAttestation.attestation.deriveKey
                            .derive_32bytes
                        }
                      </div>
                    </div>
                    <div className="bg-black/30 p-2 rounded">
                      <div className="text-gray-400">Quote:</div>
                      <div className="text-white/70 break-all">
                        {selectedAttestation.attestation.tdxQuote.quote.slice(
                          0,
                          50
                        )}
                        ...
                      </div>
                    </div>
                    <div className="bg-black/30 p-2 rounded">
                      <div className="text-gray-400">Event Log:</div>
                      <div className="text-white/70 whitespace-pre-wrap">
                        {JSON.stringify(
                          JSON.parse(
                            selectedAttestation.attestation.tdxQuote.event_log
                          ),
                          null,
                          2
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-center mt-8">
                Select an attestation to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
