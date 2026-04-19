import JSONEditor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.css'
import { useEffect, useRef, useState } from 'react'
import './JsonTools.css'

const JsonTools = () => {
  const [json, setJson] = useState(null)
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

  return (
    <div className="flex h-full flex-col space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">JSON Tools</h2>
      <div className="flex h-[90%] flex-1 gap-4">
        <div className="w-2/5 flex-1" ref={codeRef} />
        <div className="w-3/5 flex-1" ref={treeRef} />
      </div>
    </div>
  )
}

export default JsonTools
