import { useState, useEffect, useRef } from 'react'
import { Download } from 'lucide-react'
import QRCode from 'qrcode'

const QrCodeTool = () => {
  const [input, setInput] = useState('')
  const [size, setSize] = useState(256)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const canvasRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('qrcode-input')
    if (saved) setInput(saved)
  }, [])

  const handleFocus = (e) => e.target.select()

  useEffect(() => {
    localStorage.setItem('qrcode-input', input)
  }, [input])

  useEffect(() => {
    const generateQR = async () => {
      if (!input) {
        setQrDataUrl('')
        return
      }
      try {
        const dataUrl = await QRCode.toDataURL(input, {
          width: size,
          margin: 2,
          color: { dark: '#1f2937', light: '#ffffff' },
        })
        setQrDataUrl(dataUrl)
      } catch (err) {
        console.error('QR generation error:', err)
      }
    }
    generateQR()
  }, [input, size])

  const downloadQR = () => {
    if (!qrDataUrl) return
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = qrDataUrl
    link.click()
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          QR Code Generator
        </h2>
        <div className="space-y-4">
          <div>
            <label className="label">Enter text or URL</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={handleFocus}
              autoFocus
              placeholder="https://example.com"
              rows={3}
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Size</label>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="input-field w-auto appearance-none bg-none"
            >
              <option value={128}>128 x 128</option>
              <option value={256}>256 x 256</option>
              <option value={512}>512 x 512</option>
              <option value={1024}>1024 x 1024</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Generated QR Code</h3>
          <button
            onClick={downloadQR}
            disabled={!qrDataUrl}
            className="btn flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Download PNG
          </button>
        </div>
        <div className="flex justify-center rounded-xl bg-white p-6">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Code" className="max-w-full" />
          ) : (
            <div className="flex h-64 w-64 items-center justify-center text-gray-400">
              Enter text to generate QR code
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QrCodeTool
