export function clampScore(score: number, min = 0, max = 3) {
  return Math.max(min, Math.min(max, score));
}

export function avg(scores: number[]) {
  if (!scores.length) return 0;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}
