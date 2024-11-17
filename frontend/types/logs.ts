export type LogType = "game" | "move" | "draw" | "tx" | "error";

export interface GameLog {
  type: LogType;
  message: string;
  timestamp: string;
  txHash?: string;
}
