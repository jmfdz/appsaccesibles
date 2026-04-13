const NUMBER_MAP: Record<string, string> = {
  '0': 'j',
  '1': 'a',
  '2': 'b',
  '3': 'c',
  '4': 'd',
  '5': 'e',
  '6': 'f',
  '7': 'g',
  '8': 'h',
  '9': 'i',
}

const NUMERATOR_MAP: Record<string, string> = {
  '0': '>',
  '1': ',',
  '2': ';',
  '3': ':',
  '4': '*',
  '5': '?',
  '6': '+',
  '7': '=',
  '8': '<',
  '9': '}',
}

const GREEK_RULES = [
  ['alpha', "'a"],
  ['Alpha', '^a'],
  ['beta', "'b"],
  ['Beta', '^b'],
  ['gamma', "'g"],
  ['Gamma', '^g'],
  ['delta', "'d"],
  ['Delta', '^d'],
  ['epsilon', "'e"],
  ['Epsilon', '^e'],
  ['zeta', "'z"],
  ['Zeta', '^z'],
  ['eta', "'5"],
  ['Eta', '^5'],
  ['theta', "'4"],
  ['Theta', '^4'],
  ['iota', "'i"],
  ['Iota', '^i'],
  ['kappa', "'k"],
  ['Kappa', '^k'],
  ['lambda', "'l"],
  ['Lambda', '^l'],
  ['mu', "'m"],
  ['Mu', '^m'],
  ['nu', "'n"],
  ['Nu', '^n'],
  ['xi', "'x"],
  ['Xi', '^x'],
  ['omicron', "'o"],
  ['Omicron', '^o'],
  ['pi', "'p"],
  ['Pi', '^p'],
  ['rho', "'r"],
  ['Rho', '^r'],
  ['sigma', "'s"],
  ['Sigma', '^s'],
  ['tau', "'t"],
  ['Tau', '^t'],
  ['upsilon', "'u"],
  ['Upsilon', '^u'],
  ['phi', "'f"],
  ['Phi', '^f'],
  ['chi', "'&"],
  ['Chi', '^&'],
  ['psi', "'y"],
  ['Psi', '^y'],
  ['omega', "'w"],
  ['Omega', '^w'],
] as const

function numberToBraille(value: string) {
  let output = '#'

  for (const char of value) {
    if (NUMBER_MAP[char]) {
      output += NUMBER_MAP[char]
    } else if (char === ',') {
      output += char
    }
  }

  return output
}

function numeratorToBraille(value: string) {
  let output = '#'

  for (const char of value) {
    if (NUMERATOR_MAP[char]) {
      output += NUMERATOR_MAP[char]
    }
  }

  return output
}

function findMatchingBackward(index: number, expression: string) {
  const stack: string[] = []

  for (let cursor = index; cursor > 0; cursor -= 1) {
    const char = expression[cursor]

    if (char === '|') {
      stack.push('|')
    } else if (char === '2') {
      stack.pop()

      if (stack.length === 0) {
        return cursor
      }
    }
  }

  return -1
}

function findMatchingForward(index: number, expression: string) {
  const stack: string[] = []

  for (let cursor = index; cursor < expression.length; cursor += 1) {
    const char = expression[cursor]

    if (char === '2') {
      stack.push('2')
    } else if (char === '|') {
      stack.pop()

      if (stack.length === 0) {
        return cursor
      }
    }
  }

  return -1
}

function findProbableIndexes(expression: string) {
  const indexes: number[] = []

  for (let index = 0; index < expression.length; index += 1) {
    const current = expression[index]
    const next = expression[index + 1]

    if ((current === '5' || current === '1' || current === '*') && next === '2') {
      indexes.push(index + 1)
    } else if (current === '|' && next === '*') {
      indexes.push(index)
    }
  }

  return indexes
}

function addAuxiliaryParentheses(expression: string) {
  const chars = expression.split('')

  for (const index of findProbableIndexes(expression)) {
    const current = chars[index]

    if (current === '2') {
      const matchingIndex = findMatchingForward(index, chars.join(''))

      if (matchingIndex !== -1) {
        chars[index] = '?'
        chars[matchingIndex] = '}'
      }
    } else if (current === '|') {
      const matchingIndex = findMatchingBackward(index, chars.join(''))

      if (matchingIndex !== -1) {
        chars[index] = '}'
        chars[matchingIndex] = '?'
      }
    }
  }

  return chars.join('')
}

function addAuxiliaryParenthesesToMathFragments(text: string) {
  let output = ''
  let cursor = 0

  while (cursor < text.length) {
    const start = text.indexOf('\\_', cursor)

    if (start === -1) {
      output += text.slice(cursor)
      break
    }

    output += text.slice(cursor, start)

    const end = text.indexOf('_\\', start + 2)

    if (end === -1) {
      output += addAuxiliaryParentheses(text.slice(start))
      break
    }

    output += addAuxiliaryParentheses(text.slice(start, end + 2))
    cursor = end + 2
  }

  return output
}

function normalizeMathSpacing(input: string) {
  return input.replace(/`[^`]*`/g, (fragment) => fragment.replace(/([^,])\s/g, '$1'))
}

function parseFraction(segment: string) {
  const match = /^(\d+)\/(\d+)/.exec(segment)

  if (!match) {
    return null
  }

  return {
    output: numeratorToBraille(match[1]) + numberToBraille(match[2]).slice(1),
    advance: match[0].length,
  }
}

function parseNumber(segment: string) {
  const lettered = /^(\d+(?:,\d+)?)([a-j])/.exec(segment)

  if (lettered) {
    return {
      output: `${numberToBraille(lettered[1])}@`,
      advance: lettered[0].length,
    }
  }

  const decimal = /^\d+,\d+/.exec(segment)

  if (decimal) {
    return {
      output: numberToBraille(decimal[0]),
      advance: decimal[0].length,
    }
  }

  const integer = /^\d+/.exec(segment)

  if (integer) {
    return {
      output: numberToBraille(integer[0]),
      advance: integer[0].length,
    }
  }

  return null
}

type MathState = {
  env: string
}

function appendMathRule(output: string, advance: number, env = '') {
  return { output, advance, env }
}

function parseGreek(segment: string) {
  for (const [source, target] of GREEK_RULES) {
    if (segment.startsWith(source)) {
      return { output: target, advance: source.length }
    }
  }

  return null
}

function parseOutsideSegment(segment: string) {
  if (segment.startsWith('\uFEFF')) {
    return appendMathRule('', 1)
  }

  if (segment.startsWith('`')) {
    return appendMathRule('\\_', 1)
  }

  if (segment.startsWith("'")) {
    return appendMathRule('.', 1)
  }

  if (segment.startsWith('"')) {
    return appendMathRule('<', 1)
  }

  if (segment.startsWith('!')) {
    return appendMathRule('+', 1)
  }

  if (segment.startsWith('\r\n')) {
    return appendMathRule('<br>', 2)
  }

  if (segment.startsWith('\n') || segment.startsWith('\r')) {
    return appendMathRule('<br>', 1)
  }

  const fraction = parseFraction(segment)

  if (fraction) {
    return fraction
  }

  const number = parseNumber(segment)

  if (number) {
    return number
  }

  if (segment.startsWith('%')) {
    return appendMathRule('%>', 1)
  }

  if (segment.startsWith('(')) {
    return appendMathRule('2', 1)
  }

  if (segment.startsWith(')')) {
    return appendMathRule('|', 1)
  }

  const char = segment[0]

  if (/[A-Z]/.test(char)) {
    return appendMathRule(`{${char.toLowerCase()}`, 1)
  }

  return appendMathRule(char, 1)
}

function parseMathSegment(segment: string, state: MathState) {
  if (segment.startsWith('`')) {
    state.env = ''
    return appendMathRule('_\\', 1)
  }

  if (segment.startsWith('\\\\')) {
    return appendMathRule('\\', 2)
  }

  if (segment.startsWith('\\')) {
    return appendMathRule('', 1)
  }

  const fraction = parseFraction(segment)

  if (fraction) {
    return fraction
  }

  const number = parseNumber(segment)

  if (number) {
    return number
  }

  if (segment.startsWith('+-')) {
    return appendMathRule('+:-', 2)
  }

  if (segment.startsWith('%')) {
    return appendMathRule('%>', 1)
  }

  if (segment.startsWith('aleph')) {
    return appendMathRule('_8', 5)
  }

  const greek = parseGreek(segment)

  if (greek) {
    return greek
  }

  if (segment.startsWith('del')) {
    return appendMathRule('%d', 3)
  }

  if (segment.startsWith('grad')) {
    return appendMathRule("'7", 4)
  }

  if (segment.startsWith('int_{')) {
    state.env += 'i'
    return appendMathRule('&', 5)
  }

  if (/^(?:int)+(?=[^_])/.test(segment)) {
    const match = /^(?:int)+/.exec(segment)?.[0] ?? 'int'
    return appendMathRule(`${'&'.repeat(match.length / 3)}5`, match.length)
  }

  if (segment.startsWith('!in') && segment[3] !== 't') {
    return appendMathRule('^2,', 3)
  }

  if (segment.startsWith('in') && segment[2] !== 't') {
    return appendMathRule('2,', 2)
  }

  if (segment.startsWith('not')) {
    return appendMathRule('_.', 3)
  }

  if (segment.startsWith('prod_{')) {
    state.env += 'i'
    return appendMathRule('^p', 6)
  }

  if (/^prod(?=[^_])/.test(segment)) {
    return appendMathRule('^p5', 4)
  }

  if (segment.startsWith('prop')) {
    return appendMathRule('proporcional a', 4)
  }

  if (segment.startsWith('!sube')) {
    return appendMathRule('^2;', 5)
  }

  if (segment.startsWith('sube')) {
    return appendMathRule('2;', 4)
  }

  if (segment.startsWith('!sub') && segment[4] !== 'e') {
    return appendMathRule('^2;', 4)
  }

  if (segment.startsWith('sub') && segment[3] !== 'e') {
    return appendMathRule('2.', 3)
  }

  if (segment.startsWith('sum_{')) {
    state.env += 'i'
    return appendMathRule('^s', 5)
  }

  if (/^sum(?=[^_])/.test(segment)) {
    return appendMathRule('^s5', 3)
  }

  if (segment.startsWith('supe')) {
    return appendMathRule('"|', 4)
  }

  if (segment.startsWith('sup') && segment[3] !== 'e') {
    return appendMathRule('_|', 3)
  }

  if (segment.startsWith('lim_{')) {
    state.env += 'l'
    return appendMathRule('lim.', 5)
  }

  if (segment.startsWith('ln')) {
    return appendMathRule('ln.', 2)
  }

  if (segment.startsWith('log_{')) {
    state.env += 'L'
    return appendMathRule('log.', 5)
  }

  if (segment.startsWith('log')) {
    return appendMathRule('log.', 3)
  }

  if (segment.startsWith('cos')) {
    return appendMathRule('cos.', 3)
  }

  if (segment.startsWith('sin')) {
    return appendMathRule('sin.', 3)
  }

  if (segment.startsWith('tan')) {
    return appendMathRule('tan.', 3)
  }

  if (/^root\[.*?\]/.test(segment)) {
    const match = /^root\[.*?\]/.exec(segment)?.[0] ?? ''
    const indexValue = match.slice(5, -1)
    return appendMathRule(`6${convertTextToTalpBraille(indexValue)}5`, match.length)
  }

  if (segment.startsWith('sqrt')) {
    return appendMathRule('65', 4)
  }

  if (
    segment.startsWith('^^^') ||
    segment.startsWith('vvv') ||
    segment.startsWith('^^') ||
    segment.startsWith('vv')
  ) {
    const startsWithAnd = segment.startsWith('^')
    return appendMathRule(
      startsWithAnd ? '",' : '".',
      startsWithAnd ? (segment.startsWith('^^^') ? 3 : 2) : segment.startsWith('vvv') ? 3 : 2,
    )
  }

  if (segment.startsWith('^**')) {
    return appendMathRule('*.', 3)
  }

  if (segment.startsWith('^+')) {
    return appendMathRule('+.', 2)
  }

  if (segment.startsWith('^-')) {
    return appendMathRule('-.', 2)
  }

  let match = /^\^\{(\d)\+\}/.exec(segment)

  if (match) {
    return appendMathRule(`1${numberToBraille(match[1])}+.`, match[0].length)
  }

  match = /^\^\{(\d)\-\}/.exec(segment)

  if (match) {
    return appendMathRule(`1${numberToBraille(match[1])}-.`, match[0].length)
  }

  match = /^\^\{(\+{1,3})\}/.exec(segment)

  if (match) {
    return appendMathRule(`${'+'.repeat(match[1].length)}.`, match[0].length)
  }

  match = /^\^\{(\-{1,3})\}/.exec(segment)

  if (match) {
    return appendMathRule(`${'-'.repeat(match[1].length)}.`, match[0].length)
  }

  if (segment.startsWith('_+')) {
    return appendMathRule('/+.', 2)
  }

  if (segment.startsWith('_-')) {
    return appendMathRule('/-.', 2)
  }

  match = /^\_\{(\d)\+\}/.exec(segment)

  if (match) {
    return appendMathRule(`/${numberToBraille(match[1])}+.`, match[0].length)
  }

  match = /^\_\{(\d)\-\}/.exec(segment)

  if (match) {
    return appendMathRule(`/${numberToBraille(match[1])}-.`, match[0].length)
  }

  match = /^\_\{(\+{1,3})\}/.exec(segment)

  if (match) {
    return appendMathRule(`/${'+'.repeat(match[1].length)}.`, match[0].length)
  }

  match = /^\_\{(\-{1,3})\}/.exec(segment)

  if (match) {
    return appendMathRule(`/${'-'.repeat(match[1].length)}.`, match[0].length)
  }

  if (segment.startsWith('^')) {
    return appendMathRule('1', 1)
  }

  if (segment.startsWith('nnn') || segment.startsWith('nn')) {
    return appendMathRule('|5', segment.startsWith('nnn') ? 3 : 2)
  }

  if (segment.startsWith('uuu') || segment.startsWith('uu')) {
    return appendMathRule('|u', segment.startsWith('uuu') ? 3 : 2)
  }

  if (segment.startsWith('O/')) {
    return appendMathRule('%j', 2)
  }

  if (segment.startsWith('*')) {
    return appendMathRule('<', 1)
  }

  if (segment.startsWith('///')) {
    return appendMathRule('*', 3)
  }

  if (segment.startsWith('//')) {
    return appendMathRule('_,', 2)
  }

  if (segment.startsWith('|\\|')) {
    return appendMathRule('%l', 3)
  }

  if (segment.startsWith('|')) {
    return appendMathRule('%', 1)
  }

  if (segment.startsWith('/')) {
    return appendMathRule('*', 1)
  }

  if (segment.startsWith('_')) {
    return appendMathRule('/', 1)
  }

  if (segment.startsWith('(')) {
    return appendMathRule('2', 1)
  }

  if (segment.startsWith(')')) {
    return appendMathRule('|', 1)
  }

  if (segment.startsWith('[')) {
    return appendMathRule('(', 1)
  }

  if (segment.startsWith(']_{')) {
    state.env += 'i'
    return appendMathRule(')', 3)
  }

  if (segment.startsWith(']')) {
    if (state.env.endsWith('a')) {
      state.env = state.env.slice(0, -1)
      return appendMathRule('5', 1)
    }

    return appendMathRule(')', 1)
  }

  if (segment.startsWith('{')) {
    return appendMathRule('@l', 1)
  }

  if (segment.startsWith('}^{')) {
    if (state.env.endsWith('i')) {
      state.env = `${state.env.slice(0, -1)}S`
      return appendMathRule(':', 3)
    }

    return appendMathRule(" 'ERROR' ", 3)
  }

  if (segment.startsWith('}')) {
    if (state.env.endsWith('S') || state.env.endsWith('l') || state.env.endsWith('L')) {
      state.env = state.env.slice(0, -1)
      return appendMathRule('5', 1)
    }

    return appendMathRule('%,', 1)
  }

  if (/^->[A-Z]/.test(segment) && !state.env.endsWith('l')) {
    return appendMathRule('::,', 2)
  }

  if (segment.startsWith('->')) {
    return appendMathRule(':,', 2)
  }

  if (segment.startsWith('=>')) {
    return appendMathRule(':o', 2)
  }

  if (segment.startsWith('iff')) {
    return appendMathRule('9:o', 3)
  }

  if (segment.startsWith('oo')) {
    return appendMathRule('#8', 2)
  }

  if (segment.startsWith('~=') || segment.startsWith('~~')) {
    return appendMathRule("'=", 2)
  }

  if (segment.startsWith('-=')) {
    return appendMathRule('==', 2)
  }

  if (segment.startsWith('!=')) {
    return appendMathRule('^=', 2)
  }

  if (segment.startsWith('>')) {
    return appendMathRule('o', 1)
  }

  if (segment.startsWith('<')) {
    return appendMathRule('9', 1)
  }

  if (segment.startsWith('AA')) {
    return appendMathRule('{.', 2)
  }

  if (segment.startsWith('CC')) {
    return appendMathRule('%c', 2)
  }

  if (segment.startsWith('EE')) {
    return appendMathRule('{?', 2)
  }

  if (segment.startsWith('NN')) {
    return appendMathRule('%n', 2)
  }

  if (segment.startsWith('QQ')) {
    return appendMathRule('%q', 2)
  }

  if (segment.startsWith('RR')) {
    return appendMathRule('%r', 2)
  }

  if (segment.startsWith('ZZ')) {
    return appendMathRule('%z', 2)
  }

  if (segment.startsWith('ox')) {
    return appendMathRule('o<', 2)
  }

  if (segment.startsWith('(:')) {
    return appendMathRule('@k', 2)
  }

  if (segment.startsWith(':)')) {
    return appendMathRule('{,', 2)
  }

  if (segment.startsWith('\r\n')) {
    return appendMathRule('<br>', 2)
  }

  if (segment.startsWith('\n') || segment.startsWith('\r')) {
    return appendMathRule('<br>', 1)
  }

  const char = segment[0]

  if (/[A-Z]/.test(char)) {
    return appendMathRule(`{${char.toLowerCase()}`, 1)
  }

  if (segment.startsWith("'''")) {
    return appendMathRule('888', 3)
  }

  if (segment.startsWith("''")) {
    return appendMathRule('88', 2)
  }

  if (segment.startsWith("'")) {
    return appendMathRule('8', 1)
  }

  if (/^bar[a-zA-Z]/.test(segment)) {
    return appendMathRule("'c", 3)
  }

  if (/^hat[a-zA-Z]/.test(segment)) {
    return appendMathRule('^:', 3)
  }

  if (/^vec[a-zA-Z]/.test(segment)) {
    return appendMathRule(':,', 3)
  }

  return appendMathRule(char, 1)
}

export function convertTextToTalpBraille(input: string) {
  const normalizedInput = `${normalizeMathSpacing(input)}\0`
  const state: MathState = { env: '' }
  let output = ''
  let inMath = false
  let index = 0

  while (index < normalizedInput.length) {
    const segment = normalizedInput.slice(index)

    if (segment[0] === '\0') {
      break
    }

    const result = inMath ? parseMathSegment(segment, state) : parseOutsideSegment(segment)

    if (!inMath && segment.startsWith('`')) {
      inMath = true
      state.env = ''
    } else if (inMath && segment.startsWith('`')) {
      inMath = false
    }

    output += result.output
    index += result.advance
  }

  return addAuxiliaryParenthesesToMathFragments(output)
}
