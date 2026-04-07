import { useState, useEffect } from 'react'
import OutputField from './OutputField'

const TimestampTools = () => {
  const [input, setInput] = useState('')
  const [date, setDate] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('timestamp-input')
    if (saved) setInput(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('timestamp-input', input)
  }, [input])

  useEffect(() => {
    if (!input.trim()) {
      setDate(null)
      return
    }

    const parsed = new Date(input)
    if (!isNaN(parsed.getTime())) {
      setDate(parsed)
    } else {
      const num = Number(input)
      if (!isNaN(num)) {
        const ms = num > 9999999999 ? num : num * 1000
        setDate(new Date(ms))
      } else {
        setDate(null)
      }
    }
  }, [input])

  const formatDate = (d, options) => {
    if (!d) return ''
    return d.toLocaleDateString('en-US', options)
  }

  const unixSeconds = date ? Math.floor(date.getTime() / 1000) : ''
  const unixMs = date ? date.getTime() : ''
  const isoString = date ? date.toISOString() : ''

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Timestamp / Date
        </h2>
        <div className="space-y-2">
          <label className="label">Enter timestamp (seconds/ms) or date string</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="1735689600 or 2024-12-31 or 2024-12-31T12:00:00Z"
            className="input-field"
          />
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Results</h3>
        <OutputField
          label="Human Readable"
          value={
            date
              ? formatDate(date, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })
              : !input
                ? ''
                : 'Invalid date'
          }
          isError={input && !date}
        />
        <OutputField label="ISO String" value={isoString} />
        <OutputField label="Unix Timestamp (seconds)" value={unixSeconds.toString()} />
        <OutputField label="Unix Timestamp (ms)" value={unixMs.toString()} />
      </div>

      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Current Time</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <p className="text-sm text-gray-500 dark:text-gray-400">Seconds</p>
            <p className="text-lg font-mono text-gray-900 dark:text-white">
              {Math.floor(Date.now() / 1000)}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <p className="text-sm text-gray-500 dark:text-gray-400">Milliseconds</p>
            <p className="text-lg font-mono text-gray-900 dark:text-white">{Date.now()}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <p className="text-sm text-gray-500 dark:text-gray-400">ISO</p>
            <p className="text-xs font-mono text-gray-900 dark:text-white">
              {new Date().toISOString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimestampTools
