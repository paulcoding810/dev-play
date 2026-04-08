import { useState, useEffect } from 'react'
import OutputField from './OutputField'

const JsonTools = () => {
  const [input, setInput] = useState('')
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState('')
  const [prettyOutput, setPrettyOutput] = useState('')
  const [minifiedOutput, setMinifiedOutput] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('json-input')
    if (saved) setInput(saved)
  }, [])

  const handleFocus = (e) => e.target.select()

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

  useEffect(() => {
    if (input.trim()) {
      if (validateJson(input)) {
        setPrettyOutput(JSON.stringify(JSON.parse(input), null, 2))
        setMinifiedOutput(JSON.stringify(JSON.parse(input)))
      } else {
        setPrettyOutput('')
        setMinifiedOutput('')
      }
    } else {
      setIsValid(true)
      setError('')
      setPrettyOutput('')
      setMinifiedOutput('')
    }
  }, [input])

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">JSON Tools</h2>
        <div className="space-y-2">
          <label className="label">Enter JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={handleFocus}
            autoFocus
            placeholder='{"key": "value"}'
            rows={8}
            className={`input-field font-mono ${!isValid && input ? 'border-red-500 dark:border-red-500' : ''}`}
          />
          {!isValid && input && (
            <p className="mt-2 text-sm text-red-500 dark:text-red-400">Invalid JSON: {error}</p>
          )}
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Output</h3>
        <OutputField label="Pretty (formatted)" value={prettyOutput} />
        <OutputField label="Minified" value={minifiedOutput} />
      </div>
    </div>
  )
}

export default JsonTools
