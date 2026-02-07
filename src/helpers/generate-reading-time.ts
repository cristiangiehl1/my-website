export function generateReadingTime(text: string, wordsPerMinute = 200) {
  const words = text.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)

  return {
    words,
    minutes,
    text: `${minutes} min`,
  }
}
