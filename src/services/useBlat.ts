const BRAILLE_DIGIT_MAP: Record<string, string> = {
  a: '1',
  b: '2',
  c: '3',
  d: '4',
  e: '5',
  f: '6',
  g: '7',
  h: '8',
  i: '9',
  j: '0',
}

const BRAILLE_NUMERATOR_MAP: Record<string, string> = {
  '>': '0',
  ',': '1',
  ';': '2',
  ':': '3',
  '*': '4',
  '?': '5',
  '+': '6',
  '=': '7',
  '<': '8',
  '}': '9',
}

const GREEK_LOWER_MAP: Record<string, string> = {
  a: 'alpha',
  b: 'beta',
  g: 'gamma',
  d: 'delta',
  e: 'epsilon',
  z: 'zeta',
  '5': 'eta',
  '4': 'theta',
  i: 'iota',
  k: 'kappa',
  l: 'lambda',
  m: 'mu',
  n: 'nu',
  x: 'xi',
  o: 'omicron',
  p: 'pi',
  r: 'rho',
  s: 'sigma',
  t: 'tau',
  u: 'upsilon',
  f: 'phi',
  '&': 'chi',
  y: 'psi',
  w: 'omega',
}

const GREEK_UPPER_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(GREEK_LOWER_MAP).map(([key, value]) => [key, `${value[0].toUpperCase()}${value.slice(1)}`]),
)

function convertBrailleDigits(value: string) {
  let output = ''

  for (const char of value) {
    output += BRAILLE_DIGIT_MAP[char] ?? char
  }

  return output
}

function convertBrailleNumerator(value: string) {
  let output = ''

  for (const char of value) {
    output += BRAILLE_NUMERATOR_MAP[char] ?? char
  }

  return output
}

function decodeNumber(input: string, index: number) {
  if (input[index] !== '#') {
    return null
  }

  const match = /^#([a-j]+(?:\.[a-j]+)*(?:_,[a-j]+)*(?:,[a-j]+)*)/.exec(input.slice(index))

  if (!match) {
    return null
  }

  return {
    output: convertBrailleDigits(match[1]).replaceAll('_,', '/'),
    advance: match[0].length,
  }
}

function decodeFraction(input: string, index: number) {
  if (input[index] !== '#' || !BRAILLE_NUMERATOR_MAP[input[index + 1] ?? '']) {
    return null
  }

  const segment = input.slice(index + 1)
  const fractionMatch = /^([,;:*?+=<}]+)([a-j]+)/.exec(segment)

  if (!fractionMatch) {
    return null
  }

  return {
    output: `${convertBrailleNumerator(fractionMatch[1])}/${convertBrailleDigits(fractionMatch[2])}`,
    advance: 1 + fractionMatch[0].length,
  }
}

function decodeOutside(input: string) {
  let output = ''
  let index = 0

  while (index < input.length) {
    const segment = input.slice(index)

    if (segment.startsWith('<br>')) {
      output += '\n'
      index += 4
      continue
    }

    if (segment.startsWith('<br />')) {
      output += '\n'
      index += 6
      continue
    }

    const fraction = decodeFraction(input, index)

    if (fraction) {
      output += fraction.output
      index += fraction.advance
      continue
    }

    const number = decodeNumber(input, index)

    if (number) {
      output += number.output
      index += number.advance
      continue
    }

    const current = input[index]
    const next = input[index + 1]

    if (current === '{' && /[a-z]/.test(next ?? '')) {
      output += next.toUpperCase()
      index += 2
      continue
    }

    if (current === '2') {
      output += '('
      index += 1
      continue
    }

    if (current === '|' || current === '}') {
      output += ')'
      index += 1
      continue
    }

    if (current === '.') {
      output += "'"
      index += 1
      continue
    }

    if (current === '<') {
      output += '"'
      index += 1
      continue
    }

    output += current
    index += 1
  }

  return output
}

function decodeMath(input: string) {
  let output = ''
  let index = 0

  while (index < input.length) {
    const segment = input.slice(index)

    const fraction = decodeFraction(input, index)

    if (fraction) {
      output += fraction.output
      index += fraction.advance
      continue
    }

    const number = decodeNumber(input, index)

    if (number) {
      output += number.output
      index += number.advance
      continue
    }

    if (segment.startsWith('_8')) {
      output += '\\aleph'
      index += 2
      continue
    }

    if (segment.startsWith('lim.')) {
      output += '\\lim_{'
      index += 4
      continue
    }

    if (segment.startsWith('ln.')) {
      output += '\\ln'
      index += 3
      continue
    }

    if (segment.startsWith('log.')) {
      output += '\\log'
      index += 4
      continue
    }

    if (segment.startsWith('cos.')) {
      output += '\\cos'
      index += 4
      continue
    }

    if (segment.startsWith('sin.')) {
      output += '\\sin'
      index += 4
      continue
    }

    if (segment.startsWith('tan.')) {
      output += '\\tan'
      index += 4
      continue
    }

    if (segment.startsWith("'7")) {
      output += '\\nabla'
      index += 2
      continue
    }

    if (segment.startsWith("'=")) {
      output += '~='
      index += 2
      continue
    }

    if (segment.startsWith("'c")) {
      output += '\\bar'
      index += 2
      continue
    }

    if (segment.startsWith('^:')) {
      output += '\\hat'
      index += 2
      continue
    }

    if (segment.startsWith(':,')) {
      output += '\\vec'
      index += 2
      continue
    }

    if (segment.startsWith(':o')) {
      output += '=>'
      index += 2
      continue
    }

    if (segment.startsWith('9:o')) {
      output += 'iff'
      index += 3
      continue
    }

    if (segment.startsWith('#8')) {
      output += 'oo'
      index += 2
      continue
    }

    if (segment.startsWith('^=')) {
      output += '!='
      index += 2
      continue
    }

    if (segment.startsWith('==')) {
      output += '-='
      index += 2
      continue
    }

    if (segment.startsWith('^2,')) {
      output += '\\notin'
      index += 3
      continue
    }

    if (segment.startsWith('2,')) {
      output += '\\in'
      index += 2
      continue
    }

    if (segment.startsWith('_.')) {
      output += 'not'
      index += 2
      continue
    }

    if (segment.startsWith('2;')) {
      output += 'sube'
      index += 2
      continue
    }

    if (segment.startsWith('2.')) {
      output += 'sub'
      index += 2
      continue
    }

    if (segment.startsWith('"|')) {
      output += 'supe'
      index += 2
      continue
    }

    if (segment.startsWith('_|')) {
      output += 'sup'
      index += 2
      continue
    }

    if (segment.startsWith('%c')) {
      output += 'CC'
      index += 2
      continue
    }

    if (segment.startsWith('%n')) {
      output += 'NN'
      index += 2
      continue
    }

    if (segment.startsWith('%q')) {
      output += 'QQ'
      index += 2
      continue
    }

    if (segment.startsWith('%r')) {
      output += 'RR'
      index += 2
      continue
    }

    if (segment.startsWith('%z')) {
      output += 'ZZ'
      index += 2
      continue
    }

    if (segment.startsWith('%j')) {
      output += 'O/'
      index += 2
      continue
    }

    if (segment.startsWith('%d')) {
      output += 'del'
      index += 2
      continue
    }

    if (segment.startsWith('%l')) {
      output += '|\\|'
      index += 2
      continue
    }

    if (segment.startsWith('%')) {
      output += '|'
      index += 1
      continue
    }

    if (segment.startsWith('|5')) {
      output += 'nn'
      index += 2
      continue
    }

    if (segment.startsWith('|u')) {
      output += 'uu'
      index += 2
      continue
    }

    if (segment.startsWith('o<')) {
      output += 'ox'
      index += 2
      continue
    }

    if (segment.startsWith('65')) {
      output += '\\sqrt'
      index += 2
      continue
    }

    if (segment.startsWith('6')) {
      output += 'root{'
      index += 1
      continue
    }

    if (segment.startsWith('&') && input[index + 1] === '#') {
      output += '\\int_{'
      index += 1
      continue
    }

    if (segment.startsWith('&') && input[index + 1] !== '5') {
      output += '\\int_{'
      index += 1
      continue
    }

    if (segment.startsWith('^p')) {
      output += '\\prod_{'
      index += 2
      continue
    }

    if (segment.startsWith('^s')) {
      output += '\\sum_{'
      index += 2
      continue
    }

    if (segment.startsWith('1') && input[index + 1] === '#') {
      output += '^'
      index += 1
      continue
    }

    if (segment.startsWith('/')) {
      output += '_'
      index += 1
      continue
    }

    if (segment.startsWith('5')) {
      output += '}'
      index += 1
      continue
    }

    if (segment.startsWith(':')) {
      output += '}^{'
      index += 1
      continue
    }

    if (segment.startsWith('@l')) {
      output += '{'
      index += 2
      continue
    }

    if (segment.startsWith('{.')) {
      output += '\\forall'
      index += 2
      continue
    }

    if (segment.startsWith('{?')) {
      output += '\\exists'
      index += 2
      continue
    }

    if (segment.startsWith('{') && GREEK_UPPER_MAP[input[index + 1] ?? '']) {
      output += `\\${GREEK_UPPER_MAP[input[index + 1]]}`
      index += 2
      continue
    }

    if (segment.startsWith('{') && /[a-z]/.test(input[index + 1] ?? '')) {
      output += input[index + 1].toUpperCase()
      index += 2
      continue
    }

    if (segment.startsWith("'") && GREEK_LOWER_MAP[input[index + 1] ?? '']) {
      output += `\\${GREEK_LOWER_MAP[input[index + 1]]}`
      index += 2
      continue
    }

    if (segment.startsWith('^') && GREEK_UPPER_MAP[input[index + 1] ?? '']) {
      output += `\\${GREEK_UPPER_MAP[input[index + 1]]}`
      index += 2
      continue
    }

    if (segment.startsWith('2') || segment.startsWith('?')) {
      output += '('
      index += 1
      continue
    }

    if (segment.startsWith('|') || segment.startsWith('}')) {
      output += ')'
      index += 1
      continue
    }

    if (segment.startsWith('*')) {
      output += '/'
      index += 1
      continue
    }

    if (segment.startsWith('<')) {
      output += '*'
      index += 1
      continue
    }

    if (segment.startsWith('o')) {
      output += '>'
      index += 1
      continue
    }

    if (segment.startsWith('9')) {
      output += '<'
      index += 1
      continue
    }

    output += input[index]
    index += 1
  }

  return output
}

export function convertBrailleToBlatText(input: string) {
  let output = ''
  let index = 0
  let inMath = false

  while (index < input.length) {
    const segment = input.slice(index)

    if (!inMath) {
      if (segment.startsWith('\\_')) {
        inMath = true
        index += 2
        continue
      }

      const nextMath = input.indexOf('\\_', index)
      const chunk = nextMath === -1 ? input.slice(index) : input.slice(index, nextMath)
      output += decodeOutside(chunk)
      index += chunk.length
      continue
    }

    if (segment.startsWith('_\\')) {
      inMath = false
      index += 2
      continue
    }

    const nextClose = input.indexOf('_\\', index)
    const chunk = nextClose === -1 ? input.slice(index) : input.slice(index, nextClose)
    output += decodeMath(chunk)
    index += chunk.length
  }

  return output
}
