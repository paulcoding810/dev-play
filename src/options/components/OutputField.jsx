import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

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
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-purple-600 transition-all hover:bg-purple-50 disabled:opacity-50 dark:text-purple-400 dark:hover:bg-purple-900/20"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
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
