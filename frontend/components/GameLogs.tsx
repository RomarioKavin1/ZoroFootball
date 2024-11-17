// components/GameLogs.tsx
import { GameLog } from "@/types/logs";

interface GameLogsProps {
  logs: GameLog[];
  showLogs: boolean;
  setShowLogs: (show: boolean) => void;
}

export const GameLogs = ({ logs, showLogs, setShowLogs }: GameLogsProps) => {
  return (
    <div className="fixed bottom-0 right-0 z-50">
      <button
        onClick={() => setShowLogs(!showLogs)}
        className="bg-purple-600 text-white px-4 py-2 rounded-t-lg font-mono hover:bg-purple-500 transition-colors flex items-center gap-2"
      >
        {showLogs ? "▼" : "▲"} Game Logs
        <span className="bg-purple-800 px-2 py-0.5 rounded-full text-xs">
          {logs.length}
        </span>
      </button>

      <div
        className={`
          bg-black/90 
          border-t-2 border-l-2 border-purple-500
          w-96 
          transition-all duration-300 ease-in-out
          ${showLogs ? "h-96" : "h-0"}
          overflow-hidden 
        `}
      >
        <div className="p-4 h-full overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-gray-500 text-center mt-4">No logs yet</div>
          ) : (
            <div className="flex flex-col gap-2">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`
                    text-sm font-mono border-b border-purple-500/20 pb-2
                    ${log.type === "error" ? "text-red-400" : "text-white/80"}
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400">{log.timestamp}</span>
                    <span
                      className={`
                      px-1.5 py-0.5 rounded text-xs
                      ${
                        log.type === "move"
                          ? "bg-blue-500/20 text-blue-300"
                          : ""
                      }
                      ${
                        log.type === "draw"
                          ? "bg-green-500/20 text-green-300"
                          : ""
                      }
                      ${
                        log.type === "game"
                          ? "bg-orange-500/20 text-orange-300"
                          : ""
                      }
                      ${
                        log.type === "tx"
                          ? "bg-purple-500/20 text-purple-300"
                          : ""
                      }
                      ${
                        log.type === "error" ? "bg-red-500/20 text-red-300" : ""
                      }
                    `}
                    >
                      {log.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-1">{log.message}</div>
                  {log.txHash && (
                    <a
                      href={`https://testnet.chiliscan.com/tx/${log.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-purple-400 hover:text-purple-300 transition-colors mt-1 block truncate"
                    >
                      Tx: {log.txHash.slice(0, 10)}...{log.txHash.slice(-8)}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
