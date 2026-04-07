import { useState, useEffect } from 'react'
import OutputField from './OutputField'

const TextTools = () => {
  const [input, setInput] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('text-input')
    if (saved) setInput(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('text-input', input)
  }, [input])

  const upperCase = input.toUpperCase()
  const lowerCase = input.toLowerCase()
  const capitalize = input
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
  const trimmed = input.trim()
  const removeSpaces = input.replace(/\s+/g, ' ').trim()
  const charCount = input.length
  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Text Tools</h2>
        <div className="space-y-2">
          <label className="label">Enter text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your text here..."
            rows={5}
            className="input-field"
          />
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Transformations</h3>
        <OutputField label="Uppercase" value={upperCase} />
        <OutputField label="Lowercase" value={lowerCase} />
        <OutputField label="Capitalize" value={capitalize} />
        <OutputField label="Trim" value={trimmed} />
        <OutputField label="Remove extra spaces" value={removeSpaces} />
      </div>

      <div className="card space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <p className="text-sm text-gray-500 dark:text-gray-400">Characters</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{charCount}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <p className="text-sm text-gray-500 dark:text-gray-400">Words</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{wordCount}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextTools
