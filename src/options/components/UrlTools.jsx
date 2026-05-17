import { useState, useEffect } from 'react'
import OutputField from './OutputField'

const UrlTools = () => {
  const [input, setInput] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('url-tools-input')
    if (saved) setInput(saved)
  }, [])

  const handleFocus = (e) => e.target.select()

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

  const getSearchParams = () => {
    if (!input.trim()) return null

    const value = input.trim()

    try {
      if (/^[a-z][a-z\d+\-.]*:/i.test(value)) {
        return new URL(value).searchParams
      }

      const query = value.includes('?') ? value.slice(value.indexOf('?') + 1) : value
      return new URLSearchParams(query.replace(/^#/, ''))
    } catch {
      return null
    }
  }

  const parsedParameters = () => {
    const params = getSearchParams()
    if (!params) return input ? 'Invalid URL or parameter string' : ''

    const entries = Array.from(params.entries())
    if (!entries.length) return input ? 'No parameters found' : ''

    return entries.map(([key, value]) => `${key}: ${value}`).join('\n')
  }

  const parameterJson = () => {
    const params = getSearchParams()
    if (!params) return input ? 'Invalid URL or parameter string' : ''

    const entries = Array.from(params.entries())
    if (!entries.length) return input ? 'No parameters found' : ''

    const parsed = entries.reduce((result, [key, value]) => {
      if (!Object.prototype.hasOwnProperty.call(result, key)) {
        result[key] = value
      } else if (Array.isArray(result[key])) {
        result[key].push(value)
      } else {
        result[key] = [result[key], value]
      }

      return result
    }, {})

    return JSON.stringify(parsed, null, 2)
  }

  const decodedUri = decodeUri()
  const decodedUriComponent = decodeUriComponent()
  const parsedParametersOutput = parsedParameters()
  const parameterJsonOutput = parameterJson()

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">URL Tools</h2>
        <div className="space-y-2">
          <label className="label">Enter URL or text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={handleFocus}
            autoFocus
            placeholder="https://example.com?foo=bar baz"
            rows={3}
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
          value={decodedUri}
          isError={decodedUri.includes('Invalid encoded')}
        />
        <OutputField
          label="decodeURIComponent(input)"
          value={decodedUriComponent}
          isError={decodedUriComponent.includes('Invalid encoded')}
        />
      </div>

      <div className="card space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Parameters</h3>
        <OutputField
          label="Parsed parameters"
          value={parsedParametersOutput}
          isError={parsedParametersOutput.includes('Invalid URL')}
        />
        <OutputField
          label="Parameters as JSON"
          value={parameterJsonOutput}
          isError={parameterJsonOutput.includes('Invalid URL')}
        />
      </div>
    </div>
  )
}

export default UrlTools
