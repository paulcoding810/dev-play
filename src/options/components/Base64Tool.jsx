import { useState, useEffect } from 'react'
import OutputField from './OutputField'

const Base64Tool = () => {
  const [input, setInput] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('base64-input')
    if (saved) setInput(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('base64-input', input)
  }, [input])

  const encoded = input ? btoa(unescape(encodeURIComponent(input))) : ''
  const decoded = () => {
    try {
      return decodeURIComponent(escape(atob(input)))
    } catch {
      return 'Invalid Base64 string'
    }
  }

  const isValidBase64 = () => {
    if (!input) return false
    try {
      decodeURIComponent(escape(atob(input)))
      return true
    } catch {
      return false
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Base64 Encoder/Decoder
        </h2>
        <div className="space-y-2">
          <label className="label">Enter text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hello, World!"
            rows={4}
            className="input-field"
          />
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Encoding</h3>
        <OutputField label="Base64 Encode" value={encoded} />
      </div>

      <div className="card space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Decoding</h3>
        <OutputField
          label="Base64 Decode"
          value={decoded()}
          isError={!isValidBase64() && input.length > 0}
        />
      </div>
    </div>
  )
}

export default Base64Tool
