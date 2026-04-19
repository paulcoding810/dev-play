import JSONEditor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.css'
import { useEffect, useRef, useState } from 'react'
import './JsonTools.css'

const JsonTools = () => {
  const [json, setJson] = useState(null)
  const [splitPos, setSplitPos] = useState(40)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)
  const codeRef = useRef(null)
  const treeRef = useRef(null)

  useEffect(() => {
    if (!codeRef.current) return

    let savedJson = {}
    try {
      const saved = localStorage.getItem('json-input')
      if (saved) savedJson = JSON.parse(saved)
    } catch {
      savedJson = {}
    }
    setJson(savedJson)

    codeRef.current.innerHTML = ''
    new JSONEditor(codeRef.current, {
      mode: 'code',
      mainMenuBar: true,
      navigationBar: true,
      onChangeText: (jsonString) => {
        try {
          setJson(JSON.parse(jsonString))
        } catch {
          // silently ignore while typing
        }
      },
    }).set(savedJson)
  }, [])

  useEffect(() => {
    if (!treeRef.current || !json) return

    localStorage.setItem('json-input', JSON.stringify(json))
    treeRef.current.innerHTML = ''
    new JSONEditor(treeRef.current, {
      mode: 'tree',
      mainMenuBar: true,
      navigationBar: true,
      onEditable: () => false,
      onCreateMenu: () => [],
    }).set(json)
  }, [json])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault()
        document.querySelector('.jsoneditor-search input')?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

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
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">JSON Tools</h2>
      <div ref={containerRef} className="flex h-[90%] flex-1 gap-0">
        <div style={{ width: `${splitPos}%` }} className="h-full" ref={codeRef} />
        <div
          className={`w-1 cursor-col-resize bg-gray-200 hover:bg-purple-500 dark:bg-gray-700 dark:hover:bg-purple-600 ${
            isDragging ? 'bg-purple-500' : ''
          }`}
          onMouseDown={handleMouseDown}
        />
        <div style={{ width: `${100 - splitPos}%` }} className="h-full" ref={treeRef} />
      </div>
    </div>
  )
}

export default JsonTools
