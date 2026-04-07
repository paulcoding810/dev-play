import { useState, useEffect } from 'react'
import OutputField from './OutputField'

const UrlTools = () => {
  const [input, setInput] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('url-tools-input')
    if (saved) setInput(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('url-tools-input', input)
  }, [input])

  const encodeUri = input ? encodeURI(input) : ''
  const encodeUriComponent = input ? encodeURIComponent(input) : ''
  const decodeUri = () => {
    try {
      return decodeURI(input)
    } catch {
      return 'Invalid encoded URL'
    }
  }
  const decodeUriComponent = () => {
    try {
      return decodeURIComponent(input)
    } catch {
      return 'Invalid encoded component'
    }
  }
  const escapeStr = input ? escape(input) : ''
  const unescapeStr = () => {
    try {
      return unescape(input)
    } catch {
      return 'Invalid escaped string'
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">URL Tools</h2>
        <div className="space-y-2">
          <label className="label">Enter URL or text</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://example.com?foo=bar baz"
            className="input-field"
          />
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Encoding</h3>
        <OutputField label="encodeURI(input)" value={encodeUri} />
        <OutputField label="encodeURIComponent(input)" value={encodeUriComponent} />
      </div>

      <div className="card space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Decoding</h3>
        <OutputField
          label="decodeURI(input)"
          value={decodeUri()}
          isError={decodeUri().includes('Invalid')}
        />
        <OutputField
          label="decodeURIComponent(input)"
          value={decodeUriComponent()}
          isError={decodeUriComponent().includes('Invalid')}
        />
      </div>

      <div className="card space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Legacy (deprecated)</h3>
        <OutputField label="escape(input)" value={escapeStr} />
        <OutputField
          label="unescape(input)"
          value={unescapeStr()}
          isError={unescapeStr().includes('Invalid')}
        />
      </div>
    </div>
  )
}

export default UrlTools
