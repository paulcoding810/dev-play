import { useState, useEffect } from 'react'
import OutputField from './OutputField'

// accepts standard and url-safe alphabets, with or without padding
const decodeBase64 = (value) => {
  const normalized = value.trim().replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  return decodeURIComponent(escape(atob(padded)))
}

const toBase64Url = (value) => value.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

const TIME_CLAIMS = ['exp', 'nbf', 'iat']

const decodeJwt = (value) => {
  const parts = value.trim().split('.')
  if (parts.length !== 3) return null
  try {
    return {
      header: JSON.parse(decodeBase64(parts[0])),
      payload: JSON.parse(decodeBase64(parts[1])),
    }
  } catch {
    return null
  }
}

const describeTimeClaim = (claim, seconds) => {
  const date = new Date(seconds * 1000)
  if (Number.isNaN(date.getTime())) return null
  const past = date.getTime() < Date.now()
  const status =
    claim === 'exp'
      ? past
        ? ' (expired)'
        : ' (valid)'
      : claim === 'nbf' && !past
        ? ' (not yet valid)'
        : ''
  return `${date.toISOString()} / ${date.toLocaleString()}${status}`
}

const Base64Tool = () => {
  const [input, setInput] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('base64-input')
    if (saved) setInput(saved)
  }, [])

  const handleFocus = (e) => e.target.select()

  useEffect(() => {
    localStorage.setItem('base64-input', input)
  }, [input])

  const encoded = input ? btoa(unescape(encodeURIComponent(input))) : ''
  const jwt = decodeJwt(input)

  let decoded = ''
  let isDecodeError = false
  if (input && !jwt) {
    try {
      decoded = decodeBase64(input)
    } catch {
      decoded = 'Invalid Base64 string'
      isDecodeError = true
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Base64 / JWT
        </h2>
        <div className="space-y-2">
          <label className="label">Enter text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={handleFocus}
            autoFocus
            placeholder="Hello, World! or paste a JWT"
            rows={4}
            className="input-field"
          />
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Encoding</h3>
        <OutputField label="Base64 Encode" value={encoded} />
        <OutputField label="Base64URL Encode" value={toBase64Url(encoded)} />
      </div>

      {jwt ? (
        <div className="card space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">JWT</h3>
          <OutputField label="Header" value={JSON.stringify(jwt.header, null, 2)} />
          <OutputField label="Payload" value={JSON.stringify(jwt.payload, null, 2)} />
          {TIME_CLAIMS.filter((claim) => typeof jwt.payload[claim] === 'number').map((claim) => (
            <OutputField
              key={claim}
              label={claim}
              value={describeTimeClaim(claim, jwt.payload[claim]) ?? 'Invalid date'}
            />
          ))}
          <p className="text-xs text-gray-500 dark:text-gray-400">The signature is not verified.</p>
        </div>
      ) : (
        <div className="card space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Decoding</h3>
          <OutputField label="Base64 Decode" value={decoded} isError={isDecodeError} />
        </div>
      )}
    </div>
  )
}

export default Base64Tool
