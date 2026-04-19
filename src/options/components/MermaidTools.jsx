import { Download } from 'lucide-react'
import mermaid from 'mermaid'
import { useEffect, useRef, useState } from 'react'
import './MermaidTools.css'

const getMermaidTheme = (isDark) => ({
  startOnLoad: false,
  theme: 'base',
  themeVariables: isDark
    ? {
        primaryColor: '#9333ea',
        primaryTextColor: '#fff',
        primaryBorderColor: '#9333ea',
        lineColor: '#9ca3af',
        secondaryColor: '#581c87',
        tertiaryColor: '#1f2937',
        background: '#111827',
        mainBkg: '#1f2937',
        secondBkg: '#374151',
        border1: '#374151',
        border2: '#4b5563',
        arrowheadColor: '#9ca3af',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      }
    : {
        primaryColor: '#9333ea',
        primaryTextColor: '#111827',
        primaryBorderColor: '#9333ea',
        lineColor: '#6b7280',
        secondaryColor: '#f3e8ff',
        tertiaryColor: '#faf5ff',
        background: '#ffffff',
        mainBkg: '#f9fafb',
        secondBkg: '#f3e8ff',
        border1: '#e5e7eb',
        border2: '#d1d5db',
        arrowheadColor: '#6b7280',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      },
  securityLevel: 'loose',
})

const MermaidTools = () => {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [splitPos, setSplitPos] = useState(40)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)
  const renderRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('mermaid-input')
    if (saved) setInput(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('mermaid-input', input)
  }, [input])

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    mermaid.initialize(getMermaidTheme(isDark))
  }, [])

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark')
      mermaid.initialize(getMermaidTheme(isDark))
      if (input.trim() && renderRef.current) {
        renderMermaid()
      }
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [input])

  const renderMermaid = () => {
    if (!renderRef.current) return
    renderRef.current.innerHTML = ''
    setError('')
    if (!input.trim()) return
    const id = `mermaid-${Date.now()}`
    mermaid
      .render(id, input)
      .then(({ svg }) => {
        renderRef.current.innerHTML = svg
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  useEffect(() => {
    renderMermaid()
  }, [input])

  const downloadSvg = () => {
    const svg = renderRef.current?.querySelector('svg')
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${svg.id ?? new Date().now}.svg`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleMouseDown = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const newPos = ((e.clientX - rect.left) / rect.width) * 100
      setSplitPos(Math.min(Math.max(newPos, 20), 80))
    }

    const handleMouseUp = () => setIsDragging(false)

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  return (
    <div className="flex h-full flex-col space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Mermaid Tools</h2>
      <div ref={containerRef} className="flex h-[90%] flex-1 gap-0">
        <div className="card h-full" style={{ width: `${splitPos}%` }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="graph TD\n  A[Start] --> B[End]"
            className="input-field h-full w-full resize-none font-mono text-sm"
          />
        </div>
        <div
          className={`w-1 cursor-col-resize bg-gray-200 hover:bg-purple-500 dark:bg-gray-700 dark:hover:bg-purple-600 ${
            isDragging ? 'bg-purple-500' : ''
          }`}
          onMouseDown={handleMouseDown}
        />
        <div
          className="card flex h-full flex-col overflow-auto"
          style={{ width: `${100 - splitPos}%` }}
        >
          <div className="mb-2 flex justify-end">
            <button
              onClick={downloadSvg}
              disabled={!input.trim() || error}
              className="btn disabled:opacity-50"
            >
              <Download />
            </button>
          </div>
          {error ? (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          ) : (
            <div ref={renderRef} className="mermaid-render" />
          )}
        </div>
      </div>
    </div>
  )
}

export default MermaidTools
