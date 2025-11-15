export type GameType = 'phonological' | 'attention' | 'working-memory' | 'numeracy' | 'motor';

export interface GameMetrics {
  accuracy: number; // 0-1
  avgReactionTime: number; // milliseconds
  falseClicks: number;
  retries: number;
}

export interface GameResult {
  gameType: GameType;
  metrics: GameMetrics;
  timestamp: number;
}

export interface SessionResults {
  id: string;
  timestamp: number;
  games: GameResult[];
}

export type SignalLevel = 'green' | 'yellow' | 'red';

export interface DomainResult {
  domain: string;
  emoji: string;
  signal: SignalLevel;
  feedback: string;
  metrics: GameMetrics;
}
