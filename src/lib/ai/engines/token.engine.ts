export class TokenEngine {
  /**
   * Approximate token count for standard text.
   * On average, 1 token is ~4 characters of English text.
   */
  public static countTokens(text: string): number {
    if (!text) return 0;
    return Math.ceil(text.length / 4);
  }

  public static estimateCost(tokens: number, model: string = "gemini-3.5-flash"): number {
    // Standard mock pricing for Gemini Flash (input token cost roughly $0.075 / million tokens)
    const costPerToken = 0.075 / 1000000;
    return parseFloat((tokens * costPerToken).toFixed(6));
  }
}
