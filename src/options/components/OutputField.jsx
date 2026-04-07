import { useState, useEffect } from 'react'
import { Copy, Check } from 'lucide-react'

const OutputField = ({ label, value, isError = false }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (value) {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="label">{label}</label>
        <button
          onClick={handleCopy}
          disabled={!value}
          className="flex items-center gap-1 px-2 py-1 text-xs text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded transition-all disabled:opacity-50"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div
        className={`output-field ${isError ? 'text-red-500 dark:text-red-400' : ''}`}
        style={{ minHeight: '48px' }}
      >
        {value || (isError ? '' : <span className="text-gray-400">-</span>)}
      </div>
    </div>
  )
}

export default OutputField
