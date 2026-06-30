export class SecurityEngine {
  private static harmfulPatterns = [
    /ignore previous/i,
    /system prompt/i,
    /bypass restriction/i,
    /dan mode/i,
    /jailbreak/i,
  ];

  public static auditPrompt(prompt: string): { safe: boolean; reason?: string } {
    if (!prompt || typeof prompt !== "string") {
      return { safe: false, reason: "Empty prompt" };
    }

    for (const pattern of this.harmfulPatterns) {
      if (pattern.test(prompt)) {
        return { safe: false, reason: `Harmful instruction pattern detected: ${pattern.source}` };
      }
    }

    return { safe: true };
  }

  public static sanitize(input: string): string {
    if (!input) return "";
    return input
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
      .replace(/<\/?[^>]+(>|$)/g, "")
      .trim();
  }
}
