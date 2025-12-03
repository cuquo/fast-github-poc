/**
 * notice that sometimes commit messages include a PR truncated like (#3...
 */
export function extractCommitMessageAndPr(raw?: string): {
  message: string;
  pr: string | null;
} {
  if (!raw) {
    return { message: '', pr: null };
  }

  let message = raw;

  // Strict: matches "(#123)" at the end, with optional spaces around
  const strictPrMatch = message.match(/\s*(\(#(\d+)\))\s*$/);
  if (strictPrMatch) {
    const fullMatch = strictPrMatch[1]; // "(#123)"
    const prNumber = strictPrMatch[2] ?? null; // "123"

    if (prNumber) {
      // Remove only "(#123)" and trim
      message = message.replace(fullMatch, '').trim();
      return { message, pr: prNumber };
    }
  }

  // Soft: anything starting with "(#<digit>" until end
  const softMatch = message.match(/(\(#\d.*)$/);
  const prCapture = softMatch?.[1];

  if (prCapture) {
    // We do not trust it as a valid PR, we just remove the noisy tail
    message = message.replace(prCapture, '').trim();
  }

  return { message, pr: null };
}
