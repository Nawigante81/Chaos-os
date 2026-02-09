/**
 * Text animation utilities and safeguards
 */

/**
 * Validates that text is rendered completely without missing first characters
 * @param text The original text that should be rendered
 * @param renderedText The currently rendered text
 * @returns boolean indicating if the text is valid
 */
export function validateTextRendering(text: string, renderedText: string): boolean {
  if (!text || text.length === 0) return true
  if (!renderedText || renderedText.length === 0) return false
  
  // Check if the first character matches
  const firstCharMatch = text[0] === renderedText[0]
  
  // Check if the rendered text is a proper prefix of the original
  const isProperPrefix = text.startsWith(renderedText)
  
  return firstCharMatch && isProperPrefix
}

/**
 * Ensures text starts from index 0 and maintains proper sequence
 * @param fullText The complete text to be animated
 * @param currentIndex Current animation index
 * @returns string of text from index 0 to currentIndex
 */
export function getSafeAnimatedText(fullText: string, currentIndex: number): string {
  if (!fullText || fullText.length === 0) return ''
  
  // Ensure we never start from index 1 or skip characters
  const safeIndex = Math.max(0, Math.min(currentIndex, fullText.length))
  return fullText.substring(0, safeIndex + 1)
}

/**
 * Debug function to detect missing first characters
 * @param original Original string
 * @param rendered Rendered string
 * @returns string with error details or empty string if valid
 */
export function detectMissingFirstChar(original: string, rendered: string): string {
  if (!original) return 'No original text'
  if (!rendered) return 'No rendered text'
  
  if (rendered.length > 0 && rendered[0] !== original[0]) {
    return `Missing first char: expected "${original[0]}", got "${rendered[0]}"`
  }
  
  if (!original.startsWith(rendered)) {
    return `Text corruption: expected prefix of "${original}", got "${rendered}"`
  }
  
  return ''
}

/**
 * Test function to validate typewriter animation logic
 * @returns test results
 */
export function runTypewriterTests() {
  const tests = [
    {
      name: 'First character preservation',
      input: 'ZAMKNIJ',
      indices: [0, 1, 2, 3, 4, 5, 6],
      expected: ['Z', 'ZA', 'ZAM', 'ZAMK', 'ZAMKN', 'ZAMKNI', 'ZAMKNIJ']
    },
    {
      name: 'Empty text handling',
      input: '',
      indices: [0, 1, 2],
      expected: ['', '', '']
    },
    {
      name: 'Single character',
      input: 'A',
      indices: [0, 1, 2],
      expected: ['A', 'A', 'A']
    }
  ]
  
  const results = tests.map(test => {
    const actual = test.indices.map(i => getSafeAnimatedText(test.input, i))
    const passed = JSON.stringify(actual) === JSON.stringify(test.expected)
    
    return {
      name: test.name,
      passed,
      expected: test.expected,
      actual
    }
  })
  
  return results
}