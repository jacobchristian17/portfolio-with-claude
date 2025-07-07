class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private timeWindow: number; // in milliseconds

  constructor(maxRequests: number = 3, timeWindowSeconds: number = 60) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowSeconds * 1000;
  }

  async checkLimit(): Promise<boolean> {
    const now = Date.now();
    
    // Remove old requests outside time window
    this.requests = this.requests.filter(timestamp => 
      now - timestamp < this.timeWindow
    );

    // Check if we're at the limit
    if (this.requests.length >= this.maxRequests) {
      return false; // Rate limited
    }

    // Add current request
    this.requests.push(now);
    return true; // OK to proceed
  }

  async waitForAvailability(): Promise<void> {
    while (!(await this.checkLimit())) {
      // Wait 1 second before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

export const openAIRateLimiter = new RateLimiter(3, 60); // 3 requests per minute