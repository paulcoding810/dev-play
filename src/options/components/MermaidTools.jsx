import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import CodeMirror from '@uiw/react-codemirror'
import {
  mermaid as codemirrorMermaid,
  flowchartTags,
  ganttTags,
  journeyTags,
  mindmapTags,
  pieTags,
  requirementTags,
  sequenceTags,
} from 'codemirror-lang-mermaid'
import { Download } from 'lucide-react'
import mermaid from 'mermaid'
import { useEffect, useMemo, useRef, useState } from 'react'
import './MermaidTools.css'

const lightHighlightStyle = HighlightStyle.define([
  { tag: flowchartTags.diagramName, color: '#9333ea', fontWeight: 'bold' },
  { tag: flowchartTags.nodeId, color: '#1f2937', fontWeight: '500' },
  { tag: flowchartTags.nodeText, color: '#374151' },
  { tag: flowchartTags.nodeEdge, color: '#6b7280' },
  { tag: flowchartTags.nodeEdgeText, color: '#059669' },
  { tag: flowchartTags.keyword, color: '#dc2626' },
  { tag: flowchartTags.orientation, color: '#7c3aed' },
  { tag: flowchartTags.string, color: '#059669' },
  { tag: flowchartTags.number, color: '#2563eb' },
  { tag: flowchartTags.lineComment, color: '#9ca3af', fontStyle: 'italic' },
  { tag: mindmapTags.diagramName, color: '#9333ea', fontWeight: 'bold' },
  { tag: mindmapTags.lineText1, color: '#ce9178' },
  { tag: mindmapTags.lineText2, color: '#059669' },
  { tag: mindmapTags.lineText3, color: '#dc2626' },
  { tag: mindmapTags.lineText4, color: '#7c3aed' },
  { tag: mindmapTags.lineText5, color: '#2563eb' },
  { tag: pieTags.diagramName, color: '#9333ea', fontWeight: 'bold' },
  { tag: pieTags.title, color: '#1f2937', fontWeight: 'bold' },
  { tag: pieTags.titleText, color: '#374151' },
  { tag: pieTags.string, color: '#059669' },
  { tag: pieTags.number, color: '#2563eb' },
  { tag: pieTags.showData, color: '#7c3aed' },
  { tag: pieTags.lineComment, color: '#9ca3af', fontStyle: 'italic' },
  { tag: ganttTags.diagramName, color: '#9333ea', fontWeight: 'bold' },
  { tag: ganttTags.keyword, color: '#dc2626' },
  { tag: ganttTags.string, color: '#059669' },
  { tag: ganttTags.lineComment, color: '#9ca3af', fontStyle: 'italic' },
  { tag: sequenceTags.diagramName, color: '#9333ea', fontWeight: 'bold' },
  { tag: sequenceTags.arrow, color: '#6b7280' },
  { tag: sequenceTags.keyword1, color: '#dc2626' },
  { tag: sequenceTags.keyword2, color: '#7c3aed' },
  { tag: sequenceTags.nodeText, color: '#1f2937', fontWeight: '500' },
  { tag: sequenceTags.messageText1, color: '#059669' },
  { tag: sequenceTags.messageText2, color: '#374151' },
  { tag: sequenceTags.position, color: '#2563eb' },
  { tag: sequenceTags.lineComment, color: '#9ca3af', fontStyle: 'italic' },
  { tag: journeyTags.diagramName, color: '#9333ea', fontWeight: 'bold' },
  { tag: journeyTags.actor, color: '#1f2937', fontWeight: '500' },
  { tag: journeyTags.keyword, color: '#dc2626' },
  { tag: journeyTags.text, color: '#374151' },
  { tag: journeyTags.score, color: '#2563eb' },
  { tag: journeyTags.lineComment, color: '#9ca3af', fontStyle: 'italic' },
  { tag: requirementTags.diagramName, color: '#9333ea', fontWeight: 'bold' },
  { tag: requirementTags.arrow, color: '#6b7280' },
  { tag: requirementTags.keyword, color: '#dc2626' },
  { tag: requirementTags.number, color: '#2563eb' },
  { tag: requirementTags.quotedString, color: '#059669' },
  { tag: requirementTags.unquotedString, color: '#374151' },
  { tag: requirementTags.lineComment, color: '#9ca3af', fontStyle: 'italic' },
])

const darkHighlightStyle = HighlightStyle.define([
  { tag: flowchartTags.diagramName, color: '#a855f7', fontWeight: 'bold' },
  { tag: flowchartTags.nodeId, color: '#f3f4f6', fontWeight: '500' },
  { tag: flowchartTags.nodeText, color: '#d1d5db' },
  { tag: flowchartTags.nodeEdge, color: '#94a3b8' },
  { tag: flowchartTags.nodeEdgeText, color: '#34d399' },
  { tag: flowchartTags.keyword, color: '#f87171' },
  { tag: flowchartTags.orientation, color: '#c084fc' },
  { tag: flowchartTags.string, color: '#34d399' },
  { tag: flowchartTags.number, color: '#60a5fa' },
  { tag: flowchartTags.lineComment, color: '#64748b', fontStyle: 'italic' },
  { tag: mindmapTags.diagramName, color: '#a855f7', fontWeight: 'bold' },
  { tag: mindmapTags.lineText1, color: '#d4a574' },
  { tag: mindmapTags.lineText2, color: '#34d399' },
  { tag: mindmapTags.lineText3, color: '#f87171' },
  { tag: mindmapTags.lineText4, color: '#c084fc' },
  { tag: mindmapTags.lineText5, color: '#60a5fa' },
  { tag: pieTags.diagramName, color: '#a855f7', fontWeight: 'bold' },
  { tag: pieTags.title, color: '#f3f4f6', fontWeight: 'bold' },
  { tag: pieTags.titleText, color: '#d1d5db' },
  { tag: pieTags.string, color: '#34d399' },
  { tag: pieTags.number, color: '#60a5fa' },
  { tag: pieTags.showData, color: '#c084fc' },
  { tag: pieTags.lineComment, color: '#64748b', fontStyle: 'italic' },
  { tag: ganttTags.diagramName, color: '#a855f7', fontWeight: 'bold' },
  { tag: ganttTags.keyword, color: '#f87171' },
  { tag: ganttTags.string, color: '#34d399' },
  { tag: ganttTags.lineComment, color: '#64748b', fontStyle: 'italic' },
  { tag: sequenceTags.diagramName, color: '#a855f7', fontWeight: 'bold' },
  { tag: sequenceTags.arrow, color: '#94a3b8' },
  { tag: sequenceTags.keyword1, color: '#f87171' },
  { tag: sequenceTags.keyword2, color: '#c084fc' },
  { tag: sequenceTags.nodeText, color: '#f3f4f6', fontWeight: '500' },
  { tag: sequenceTags.messageText1, color: '#34d399' },
  { tag: sequenceTags.messageText2, color: '#d1d5db' },
  { tag: sequenceTags.position, color: '#60a5fa' },
  { tag: sequenceTags.lineComment, color: '#64748b', fontStyle: 'italic' },
  { tag: journeyTags.diagramName, color: '#a855f7', fontWeight: 'bold' },
  { tag: journeyTags.actor, color: '#f3f4f6', fontWeight: '500' },
  { tag: journeyTags.keyword, color: '#f87171' },
  { tag: journeyTags.text, color: '#d1d5db' },
  { tag: journeyTags.score, color: '#60a5fa' },
  { tag: journeyTags.lineComment, color: '#64748b', fontStyle: 'italic' },
  { tag: requirementTags.diagramName, color: '#a855f7', fontWeight: 'bold' },
  { tag: requirementTags.arrow, color: '#94a3b8' },
  { tag: requirementTags.keyword, color: '#f87171' },
  { tag: requirementTags.number, color: '#60a5fa' },
  { tag: requirementTags.quotedString, color: '#34d399' },
  { tag: requirementTags.unquotedString, color: '#d1d5db' },
  { tag: requirementTags.lineComment, color: '#64748b', fontStyle: 'italic' },
])

const getMermaidTheme = (isDark) => ({
  startOnLoad: false,
  theme: 'base',
  themeVariables: isDark
    ? {
        primaryColor: '#c084fc',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#a855f7',
        lineColor: '#94a3b8',
        secondaryColor: '#60a5fa',
        tertiaryColor: '#34d399',
        background: '#1e293b',
        mainBkg: '#334155',
        secondBkg: '#475569',
        border1: '#475569',
        border2: '#64748b',
        arrowheadColor: '#94a3b8',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        textColor: '#f1f5f9',
      }
    : {
        primaryColor: '#9333ea',
        primaryTextColor: '#000000',
        primaryBorderColor: '#7c3aed',
        lineColor: '#6b7280',
        secondaryColor: '#3b82f6',
        tertiaryColor: '#10b981',
        background: '#f8fafc',
        mainBkg: '#ffffff',
        secondBkg: '#f1f5f9',
        border1: '#e2e8f0',
        border2: '#cbd5e1',
        arrowheadColor: '#6b7280',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        textColor: '#000000',
      },
  securityLevel: 'loose',
})

const MermaidTools = ({ isDark }) => {
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
    mermaid.initialize(getMermaidTheme(isDark))
  }, [isDark])

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
    const timeout = setTimeout(renderMermaid, 300)
    return () => clearTimeout(timeout)
  }, [input, isDark])

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

  const highlightStyle = useMemo(
    () => (isDark ? darkHighlightStyle : lightHighlightStyle),
    [isDark],
  )

  return (
    <div className="flex h-full flex-col space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Mermaid Tools</h2>
      <div ref={containerRef} className="flex h-[90%] flex-1 gap-0">
        <div className="card h-full" style={{ width: `${splitPos}%` }}>
          <CodeMirror
            value={input}
            onChange={setInput}
            placeholder="graph TD\n  A[Start] --> B[End]"
            className="h-full text-sm"
            theme={isDark ? 'dark' : 'light'}
            height="100%"
            extensions={[codemirrorMermaid(), syntaxHighlighting(highlightStyle)]}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightSpecialChars: true,
              foldGutter: true,
              drawSelection: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              rectangularSelection: true,
              crosshairCursor: false,
              highlightActiveLine: true,
              highlightSelectionMatches: true,
              closeBracketsKeymap: true,
              defaultKeymap: true,
              searchKeymap: true,
              historyKeymap: true,
              foldKeymap: true,
              completionKeymap: true,
              lintKeymap: true,
            }}
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
          <div ref={renderRef} className="mermaid-render" />
          {error ? <p className="text-sm text-red-500 dark:text-red-400">{error}</p> : null}
        </div>
      </div>
    </div>
  )
}

export default MermaidTools
