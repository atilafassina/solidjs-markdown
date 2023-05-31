const MARKDOWN_OPERATORS = /[#*_\[\]()>]/g

function getPlainText(markdownText: string) {
  return markdownText.replace(MARKDOWN_OPERATORS, "")
}

export function countChars(markdownText: string) {
  return getPlainText(markdownText).length
}

export function countWords(markdownText: string) {
  return getPlainText(markdownText).split(/\s+/).filter(Boolean).length
}
