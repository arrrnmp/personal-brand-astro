const WORDS_PER_MINUTE = 200;

/** Estimate reading time in minutes from a raw text string. */
export function getReadingTime(text: string): number {
	const words = text.trim().split(/\s+/).length;
	return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
