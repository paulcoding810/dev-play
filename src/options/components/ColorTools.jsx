import { useState, useEffect } from 'react'
import OutputField from './OutputField'

const ColorTools = () => {
  const [input, setInput] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('color-input')
    if (saved) setInput(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('color-input', input)
  }, [input])

  const parseColor = (str) => {
    if (!str) return null

    let hex = str.trim()

    if (hex.startsWith('#')) {
      if (hex.length === 4) {
        hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
      }
      if (hex.length === 7) {
        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)
        return { r, g, b, valid: true }
      }
    }

    const rgbMatch = str.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i)
    if (rgbMatch) {
      return {
        r: Math.min(255, parseInt(rgbMatch[1])),
        g: Math.min(255, parseInt(rgbMatch[2])),
        b: Math.min(255, parseInt(rgbMatch[3])),
        valid: true,
      }
    }

    const hslMatch = str.match(/hsl\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/i)
    if (hslMatch) {
      const h = parseInt(hslMatch[1]) / 360
      const s = parseInt(hslMatch[2]) / 100
      const l = parseInt(hslMatch[3]) / 100
      const rgb = hslToRgb(h, s, l)
      return { ...rgb, valid: true }
    }

    return { valid: false }
  }

  const hslToRgb = (h, s, l) => {
    let r, g, b
    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }

  const color = parseColor(input)
  const toHex =
    color && color.valid
      ? `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`.toUpperCase()
      : ''
  const toRgb = color && color.valid ? `rgb(${color.r}, ${color.g}, ${color.b})` : ''
  const toHsl = () => {
    if (!color || !color.valid) return ''
    const r = color.r / 255
    const g = color.g / 255
    const b = color.b / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h,
      s,
      l = (max + min) / 2

    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
        default:
          h = 0
      }
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Color Tools</h2>
        <div className="space-y-4">
          <div>
            <label className="label">Enter HEX, RGB, or HSL color</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="#FF5733 or rgb(255, 87, 51) or hsl(11, 100%, 60%)"
              className="input-field"
            />
          </div>
          {color && color.valid && (
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div
                className="w-20 h-20 rounded-lg shadow-inner border border-gray-200 dark:border-gray-700"
                style={{ backgroundColor: toHex }}
              />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Preview</p>
                <p className="font-mono text-gray-900 dark:text-white">{toHex}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Conversions</h3>
        <OutputField label="HEX" value={toHex} isError={input && !color?.valid} />
        <OutputField label="RGB" value={toRgb} />
        <OutputField label="HSL" value={toHsl()} />
      </div>
    </div>
  )
}

export default ColorTools
