import { useEffect, useState } from 'react'
import OutputField from './OutputField'

const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz'

const BASES = [
  { id: 'auto', label: 'Auto' },
  { id: 'dec', label: 'Dec', radix: 10 },
  { id: 'hex', label: 'Hex', radix: 16 },
  { id: 'bin', label: 'Bin', radix: 2 },
  { id: 'oct', label: 'Oct', radix: 8 },
]

const PREFIX_RADIX = { '0x': 16, '0b': 2, '0o': 8 }

const radixOf = (base) => BASES.find((b) => b.id === base)?.radix ?? 10

const parseValue = (raw, base) => {
  let text = raw.trim().replace(/[\s_,]/g, '')
  if (!text) return { value: null, error: '' }

  const negative = text.startsWith('-')
  if (negative || text.startsWith('+')) text = text.slice(1)

  let radix = radixOf(base)
  const prefix = text.slice(0, 2).toLowerCase()
  if (PREFIX_RADIX[prefix]) {
    radix = PREFIX_RADIX[prefix]
    text = text.slice(2)
  } else if (base === 'auto' && /[a-f]/i.test(text)) {
    radix = 16
  }

  if (!text) return { value: null, error: 'Missing digits' }

  let value = 0n
  for (const char of text.toLowerCase()) {
    const digit = DIGITS.indexOf(char)
    if (digit === -1 || digit >= radix) {
      return { value: null, error: `"${char}" is not a valid base ${radix} digit` }
    }
    value = value * BigInt(radix) + BigInt(digit)
  }

  return { value: negative ? -value : value, error: '', radix }
}

const NumberBaseTools = () => {
  const [input, setInput] = useState('')
  const [base, setBase] = useState('auto')

  useEffect(() => {
    setInput(localStorage.getItem('number-base-input') ?? '')
    setBase(localStorage.getItem('number-base') ?? 'auto')
  }, [])

  useEffect(() => {
    localStorage.setItem('number-base-input', input)
    localStorage.setItem('number-base', base)
  }, [input, base])

  const handleFocus = (e) => e.target.select()

  const { value, error, radix } = parseValue(input, base)
  const magnitude = value === null ? 0n : value < 0n ? -value : value
  const format = (prefix, toBase) =>
    value === null ? '' : `${value < 0n ? '-' : ''}${prefix}${magnitude.toString(toBase)}`

  return (
    <div className="space-y-6">
      <div className="card space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Hex / Dec / Binary</h2>
        <div className="flex flex-wrap gap-2">
          {BASES.map((option) => (
            <button
              key={option.id}
              onClick={() => setBase(option.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                base === option.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <label className="label">Enter a number</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={handleFocus}
            autoFocus
            spellCheck={false}
            placeholder="255 or 0xff or 0b1010"
            className="input-field font-mono"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            A 0x / 0b / 0o prefix always wins. Auto reads bare digits as decimal.
          </p>
        </div>
        {error ? <p className="text-sm text-red-500 dark:text-red-400">{error}</p> : null}
      </div>

      <div className="card space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Conversions</h3>
        <OutputField label="Decimal" value={format('', 10)} />
        <OutputField label="Hexadecimal" value={format('0x', 16)} />
        <OutputField label="Binary" value={format('0b', 2)} />
        <OutputField label="Octal" value={format('0o', 8)} />
      </div>

      {value === null ? null : (
        <div className="card">
          <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Details</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
              <p className="text-sm text-gray-500 dark:text-gray-400">Read as base</p>
              <p className="font-mono text-lg text-gray-900 dark:text-white">{radix}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
              <p className="text-sm text-gray-500 dark:text-gray-400">Bits</p>
              <p className="font-mono text-lg text-gray-900 dark:text-white">
                {magnitude.toString(2).length}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
              <p className="text-sm text-gray-500 dark:text-gray-400">Bytes</p>
              <p className="font-mono text-lg text-gray-900 dark:text-white">
                {Math.ceil(magnitude.toString(2).length / 8)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NumberBaseTools
