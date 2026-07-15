const WORDS_PER_MINUTE = 200;

function estimateReadingTime(text = '') {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
  return minutes;
}

module.exports = { estimateReadingTime };
