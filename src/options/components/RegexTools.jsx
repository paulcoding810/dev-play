import { useEffect, useMemo, useState } from 'react'
import OutputField from './OutputField'

const FLAGS = [
  { value: 'g', label: 'global' },
  { value: 'i', label: 'ignore case' },
  { value: 'm', label: 'multiline' },
  { value: 's', label: 'dotall' },
  { value: 'u', label: 'unicode' },
  { value: 'y', label: 'sticky' },
]

const MAX_RENDERED_MATCHES = 100

const RegexTools = () => {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [input, setInput] = useState('')
  const [replacement, setReplacement] = useState('')

  useEffect(() => {
    setPattern(localStorage.getItem('regex-pattern') ?? '')
    setFlags(localStorage.getItem('regex-flags') ?? 'g')
    setInput(localStorage.getItem('regex-input') ?? '')
    setReplacement(localStorage.getItem('regex-replacement') ?? '')
  }, [])

  useEffect(() => {
    localStorage.setItem('regex-pattern', pattern)
    localStorage.setItem('regex-flags', flags)
    localStorage.setItem('regex-input', input)
    localStorage.setItem('regex-replacement', replacement)
  }, [pattern, flags, input, replacement])

  const { regex, error } = useMemo(() => {
    if (!pattern) return { regex: null, error: '' }
    try {
      return { regex: new RegExp(pattern, flags), error: '' }
    } catch (err) {
      return { regex: null, error: err.message }
    }
  }, [pattern, flags])

  const matches = useMemo(() => {
    if (!regex || !input) return []
    regex.lastIndex = 0
    if (flags.includes('g')) return Array.from(input.matchAll(regex))
    const match = regex.exec(input)
    return match ? [match] : []
  }, [regex, input, flags])

  const replaced = useMemo(() => {
    if (!regex || !input) return ''
    regex.lastIndex = 0
    try {
      return input.replace(regex, replacement)
    } catch (err) {
      return err.message
    }
  }, [regex, input, replacement])

  const highlighted = useMemo(() => {
    if (!matches.length) return null

    const parts = []
    let cursor = 0
    matches.forEach((match, index) => {
      if (match.index > cursor) parts.push(input.slice(cursor, match.index))
      parts.push(
        <mark
          key={index}
          className="inline-block min-w-[2px] rounded bg-purple-200 text-purple-900 dark:bg-purple-700 dark:text-purple-50"
        >
          {match[0]}
        </mark>,
      )
      cursor = match.index + match[0].length
    })
    parts.push(input.slice(cursor))
    return parts
  }, [matches, input])

  const toggleFlag = (flag) =>
    setFlags((current) =>
      current.includes(flag)
        ? current.replace(flag, '')
        : FLAGS.map((f) => f.value)
            .filter((f) => current.includes(f) || f === flag)
            .join(''),
    )

  return (
    <div className="space-y-6">
      <div className="card space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Regex Tester</h2>
        <div className="space-y-2">
          <label className="label">Pattern</label>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg text-gray-400">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              autoFocus
              spellCheck={false}
              placeholder="(\w+)@(\w+)\.com"
              className="input-field font-mono"
            />
            <span className="font-mono text-lg text-gray-400">/{flags}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {FLAGS.map((flag) => (
            <button
              key={flag.value}
              onClick={() => toggleFlag(flag.value)}
              title={flag.label}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                flags.includes(flag.value)
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {flag.value}
            </button>
          ))}
        </div>
        {error ? <p className="text-sm text-red-500 dark:text-red-400">{error}</p> : null}
      </div>

      <div className="card">
        <div className="space-y-2">
          <label className="label">Test string</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder="hello@example.com"
            rows={6}
            className="input-field font-mono"
          />
        </div>
      </div>

      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Matches</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {matches.length} {matches.length === 1 ? 'match' : 'matches'}
          </span>
        </div>

        {highlighted ? (
          <div className="output-field">{highlighted}</div>
        ) : (
          <div className="output-field">
            <span className="text-gray-400">{pattern && input ? 'No matches' : '-'}</span>
          </div>
        )}

        {matches.slice(0, MAX_RENDERED_MATCHES).map((match, index) => (
          <div key={index} className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
            <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Match {index + 1}</span>
              <span>index {match.index}</span>
            </div>
            <p className="break-all font-mono text-sm text-gray-900 dark:text-gray-100">
              {match[0] || <span className="text-gray-400">(empty match)</span>}
            </p>
            {match.slice(1).map((group, groupIndex) => (
              <p
                key={groupIndex}
                className="break-all font-mono text-xs text-gray-600 dark:text-gray-400"
              >
                ${groupIndex + 1} = {group === undefined ? 'undefined' : group}
              </p>
            ))}
            {Object.entries(match.groups ?? {}).map(([name, group]) => (
              <p
                key={name}
                className="break-all font-mono text-xs text-gray-600 dark:text-gray-400"
              >
                {name} = {group === undefined ? 'undefined' : group}
              </p>
            ))}
          </div>
        ))}

        {matches.length > MAX_RENDERED_MATCHES ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing the first {MAX_RENDERED_MATCHES} of {matches.length} matches
          </p>
        ) : null}
      </div>

      <div className="card space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Replace</h3>
        <div className="space-y-2">
          <label className="label">Replacement ($1, $&lt;name&gt;)</label>
          <input
            type="text"
            value={replacement}
            onChange={(e) => setReplacement(e.target.value)}
            spellCheck={false}
            placeholder="$1 at $2"
            className="input-field font-mono"
          />
        </div>
        <OutputField label="Result" value={replaced} />
      </div>
    </div>
  )
}

export default RegexTools
