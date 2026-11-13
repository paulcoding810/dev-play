import { XMLParser, XMLValidator } from 'fast-xml-parser'
import JSONEditor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.css'
import { useEffect, useRef, useState } from 'react'
import './JsonTools.css'

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  allowBooleanAttributes: true,
  parseAttributeValue: true,
  trimValues: true,
})

const COPY_LABEL = 'Copy path'

const isXmlInput = (text) => text.startsWith('<')

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/

const formatPath = (path) =>
  path
    .map((key, i) => {
      if (typeof key === 'number') return `[${key}]`
      if (IDENTIFIER.test(key)) return i === 0 ? key : `.${key}`
      return `[${JSON.stringify(key)}]`
    })
    .join('')

// migrate the old key, which stored the parsed value instead of the raw text
const loadSavedInput = () => {
  const saved = localStorage.getItem('json-tools-input')
  if (saved !== null) return saved
  try {
    const legacy = localStorage.getItem('json-input')
    return legacy ? JSON.stringify(JSON.parse(legacy), null, 2) : ''
  } catch {
    return ''
  }
}

const JsonTools = () => {
  const [input, setInput] = useState(loadSavedInput)
  const [json, setJson] = useState(null)
  const [isXml, setIsXml] = useState(false)
  const [error, setError] = useState('')
  const [splitPos, setSplitPos] = useState(40)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)
  const codeRef = useRef(null)
  const treeRef = useRef(null)
  const editorRef = useRef(null)

  useEffect(() => {
    if (!codeRef.current) return

    codeRef.current.innerHTML = ''
    editorRef.current = new JSONEditor(codeRef.current, {
      mode: 'code',
      mainMenuBar: true,
      navigationBar: true,
      onChangeText: setInput,
    })
    editorRef.current.setText(loadSavedInput())
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem('json-tools-input', input)
      const text = input.trim()

      if (!text) {
        setIsXml(false)
        setError('')
        setJson({})
        return
      }

      if (isXmlInput(text)) {
        setIsXml(true)
        const validation = XMLValidator.validate(text)
        if (validation !== true) {
          setError(`Line ${validation.err.line}: ${validation.err.msg}`)
          return
        }
        try {
          setJson(xmlParser.parse(text))
          setError('')
        } catch (err) {
          setError(err.message)
        }
        return
      }

      setIsXml(false)
      setError('')
      try {
        setJson(JSON.parse(text))
      } catch {
        // silently ignore while typing, ace already flags it
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [input])

  // the ace json worker would flag valid xml as broken json
  useEffect(() => {
    editorRef.current?.aceEditor?.getSession().setMode(isXml ? 'ace/mode/text' : 'ace/mode/json')
  }, [isXml])

  useEffect(() => {
    if (!treeRef.current || !json) return

    treeRef.current.innerHTML = ''
    const tree = new JSONEditor(treeRef.current, {
      mode: 'tree',
      mainMenuBar: true,
      navigationBar: true,
      onEditable: () => false,
      onCreateMenu: () => [],
    })
    tree.set(json)
    tree.expandAll()

    // segment text is the raw key, so keep the real path of the selected node
    let selectedPath = []
    const updateTreePath = tree._updateTreePath.bind(tree)
    tree._updateTreePath = (pathNodes) => {
      selectedPath = pathNodes.at(-1)?.getPath() ?? []
      updateTreePath(pathNodes)
    }

    const treePath = treeRef.current.querySelector('.jsoneditor-treepath')
    const navBar = treeRef.current.querySelector('.jsoneditor-navigation-bar')
    if (!treePath || !navBar) return

    // the first segment is the root node's type, which the nav bar hides
    const getSegments = () =>
      Array.from(treePath.querySelectorAll('.jsoneditor-treepath-element')).slice(1)

    let labelTimeout
    const copyButton = document.createElement('button')
    copyButton.className = 'jsoneditor-copy-path'
    copyButton.textContent = COPY_LABEL
    copyButton.title = 'Copy path to clipboard'
    copyButton.onclick = () => {
      const path = formatPath(selectedPath)
      navigator.clipboard.writeText(path).then(() => {
        copyButton.textContent = 'Copied'
        clearTimeout(labelTimeout)
        labelTimeout = setTimeout(() => {
          copyButton.textContent = COPY_LABEL
        }, 1200)
      })
    }
    navBar.appendChild(copyButton)

    const syncTreePath = () => {
      // jsoneditor renders the separator as a ► glyph, which ends up in copied paths
      treePath.querySelectorAll('.jsoneditor-treepath-seperator').forEach((el) => {
        if (el.textContent !== '.') el.textContent = '.'
      })
      copyButton.style.display = getSegments().length ? '' : 'none'
    }
    syncTreePath()

    const observer = new MutationObserver(syncTreePath)
    observer.observe(treePath, { childList: true })
    return () => {
      observer.disconnect()
      clearTimeout(labelTimeout)
    }
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
      <div className="flex items-center gap-3">
        <h2 className="shrink-0 text-xl font-semibold text-gray-900 dark:text-white">JSON Tools</h2>
        {isXml ? (
          <span className="shrink-0 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
            XML
          </span>
        ) : null}
        {error ? (
          <p className="truncate text-sm text-red-500 dark:text-red-400" title={error}>
            {error}
          </p>
        ) : null}
      </div>
      <div ref={containerRef} className="flex h-[90%] flex-1 gap-0">
        <div
          style={{ width: `${splitPos}%` }}
          className={`h-full ${isXml ? 'xml-input' : ''}`}
          ref={codeRef}
        />
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
