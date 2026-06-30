export class RateLimiter {
  private limit: number;
  private interval: number;
  private tokens: Map<string, number[]>;

  constructor(limit: number = 60, intervalMs: number = 60000) {
    this.limit = limit;
    this.interval = intervalMs;
    this.tokens = new Map();
  }

  public isAllowed(key: string): boolean {
    const now = Date.now();
    if (!this.tokens.has(key)) {
      this.tokens.set(key, []);
    }

    const timestamps = this.tokens.get(key)!;
    // Filter out timestamps outside window
    const activeTimestamps = timestamps.filter(t => now - t < this.interval);
    
    if (activeTimestamps.length >= this.limit) {
      this.tokens.set(key, activeTimestamps);
      return false;
    }

    activeTimestamps.push(now);
    this.tokens.set(key, activeTimestamps);
    return true;
  }
}

export const globalRateLimiter = new RateLimiter(60, 60000); // 60 req/min
