/**
 * Specifies social dimensions for each videos
 */
export interface Dimensions {
  Agreement: number;
  Engagement: number;
  Dominance: number;
  Performance: number;
  Rapport: number;
}

/**
 * Capitalises a word by converting its first letter to uppercase.
 *
 * @param word Word to be capitalised
 * @returns The input word with the first letter capitalised
 */
export function capitalize(word: string) {
  const firstLetter = word.slice(0, 1);
  const rest = word.slice(1);

  return firstLetter.toUpperCase() + rest;
}
