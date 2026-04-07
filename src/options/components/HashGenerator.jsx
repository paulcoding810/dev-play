import { useState, useEffect } from 'react'
import OutputField from './OutputField'

const HashGenerator = () => {
  const [input, setInput] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('hash-input')
    if (saved) setInput(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('hash-input', input)
  }, [input])

  const hashMD5 = async (str) => {
    if (!str) return ''
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return 'MD5 not available in Web Crypto API. Use SHA-256 instead.'
  }

  const hashSHA1 = async (str) => {
    if (!str) return ''
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    const hashBuffer = await crypto.subtle.digest('SHA-1', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  }

  const hashSHA256 = async (str) => {
    if (!str) return ''
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  }

  const [hashes, setHashes] = useState({ sha1: '', sha256: '' })

  useEffect(() => {
    const computeHashes = async () => {
      const sha1 = await hashSHA1(input)
      const sha256 = await hashSHA256(input)
      setHashes({ sha1, sha256 })
    }
    computeHashes()
  }, [input])

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Hash Generator</h2>
        <div className="space-y-2">
          <label className="label">Enter text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
            rows={4}
            className="input-field"
          />
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Generated Hashes</h3>
        <OutputField
          label="MD5 (not supported)"
          value={input ? 'Web Crypto API does not support MD5' : ''}
        />
        <OutputField label="SHA-1" value={hashes.sha1} />
        <OutputField label="SHA-256" value={hashes.sha256} />
      </div>
    </div>
  )
}

export default HashGenerator
