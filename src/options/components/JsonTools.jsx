import { useState, useEffect } from 'react'
import OutputField from './OutputField'

const JsonTools = () => {
  const [input, setInput] = useState('')
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('json-input')
    if (saved) setInput(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('json-input', input)
  }, [input])

  const validateJson = (str) => {
    try {
      JSON.parse(str)
      setIsValid(true)
      setError('')
      return true
    } catch (e) {
      setIsValid(false)
      setError(e.message)
      return false
    }
  }

  const pretty = () => {
    if (!input.trim()) return ''
    if (!validateJson(input)) return ''
    try {
      return JSON.stringify(JSON.parse(input), null, 2)
    } catch {
      return ''
    }
  }

  const minified = () => {
    if (!input.trim()) return ''
    if (!validateJson(input)) return ''
    try {
      return JSON.stringify(JSON.parse(input))
    } catch {
      return ''
    }
  }

  useEffect(() => {
    if (input.trim()) {
      validateJson(input)
    } else {
      setIsValid(true)
      setError('')
    }
  }, [input])

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">JSON Tools</h2>
        <div className="space-y-2">
          <label className="label">Enter JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            rows={8}
            className={`input-field font-mono ${!isValid && input ? 'border-red-500 dark:border-red-500' : ''}`}
          />
          {!isValid && input && (
            <p className="text-sm text-red-500 dark:text-red-400 mt-2">Invalid JSON: {error}</p>
          )}
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Output</h3>
        <OutputField label="Pretty (formatted)" value={pretty()} />
        <OutputField label="Minified" value={minified()} />
      </div>
    </div>
  )
}

export default JsonTools
