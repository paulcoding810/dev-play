import {
  Clock,
  Code,
  Hash,
  Link,
  Lock,
  Palette,
  QrCode,
  Search,
  Type,
  Workflow,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { categories } from '../data/categories'
import Base64Tool from './components/Base64Tool'
import ColorTools from './components/ColorTools'
import HashGenerator from './components/HashGenerator'
import JsonTools from './components/JsonTools'
import QrCodeTool from './components/QrCodeTool'
import TextTools from './components/TextTools'
import TimestampTools from './components/TimestampTools'
import UrlTools from './components/UrlTools'
import MermaidTools from './components/MermaidTools'

const components = {
  url: { component: UrlTools, icon: Link },
  qrcode: { component: QrCodeTool, icon: QrCode },
  base64: { component: Base64Tool, icon: Lock },
  json: { component: JsonTools, icon: Code },
  mermaid: { component: MermaidTools, icon: Workflow },
  text: { component: TextTools, icon: Type },
  hash: { component: HashGenerator, icon: Hash },
  timestamp: { component: TimestampTools, icon: Clock },
  color: { component: ColorTools, icon: Palette },
}

const params = new URLSearchParams(window.location.search)
const categoryParam = params.get('category')

export const Options = () => {
  const [activeCategory, setActiveCategory] = useState(
    components[categoryParam] ? categoryParam : 'url',
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('devplay-theme')
    if (saved === 'dark') {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('devplay-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('devplay-theme', 'light')
    }
  }

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const render = () => {
    const ActiveComponent = components[activeCategory]?.component

    switch (activeCategory) {
      case 'json':
      case 'mermaid':
        return (
          <div className="mx-auto h-full w-full p-8">{ActiveComponent && <ActiveComponent />}</div>
        )
      default:
        return <div className="mx-auto max-w-4xl p-8">{ActiveComponent && <ActiveComponent />}</div>
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <aside className="flex w-64 flex-col border-r border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <h1 className="mb-4 text-xl font-bold text-purple-600 dark:text-purple-400">DevPlay</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border-0 bg-gray-100 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {filteredCategories.map((category) => {
            const Icon = components[category.id]?.icon
            const isActive = activeCategory === category.id
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all ${
                  isActive
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${isActive ? 'text-purple-600 dark:text-purple-400' : ''}`}
                />
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            )
          })}
        </nav>
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-600 transition-all hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">{render()}</main>
    </div>
  )
}

export default Options
