import { useState, useEffect } from 'react'
import { Search, Link, QrCode, Lock, Code, Type, Hash, Clock, Palette } from 'lucide-react'
import UrlTools from './components/UrlTools'
import QrCodeTool from './components/QrCodeTool'
import Base64Tool from './components/Base64Tool'
import JsonTools from './components/JsonTools'
import TextTools from './components/TextTools'
import HashGenerator from './components/HashGenerator'
import TimestampTools from './components/TimestampTools'
import ColorTools from './components/ColorTools'
import './index.css'

const categories = [
  { id: 'url', name: 'URL Tools', icon: Link },
  { id: 'qrcode', name: 'QR Code', icon: QrCode },
  { id: 'base64', name: 'Base64', icon: Lock },
  { id: 'json', name: 'JSON Tools', icon: Code },
  { id: 'text', name: 'Text Tools', icon: Type },
  { id: 'hash', name: 'Hash Generator', icon: Hash },
  { id: 'timestamp', name: 'Timestamp / Date', icon: Clock },
  { id: 'color', name: 'Color Tools', icon: Palette },
]

const components = {
  url: UrlTools,
  qrcode: QrCodeTool,
  base64: Base64Tool,
  json: JsonTools,
  text: TextTools,
  hash: HashGenerator,
  timestamp: TimestampTools,
  color: ColorTools,
}

export const Options = () => {
  const [activeCategory, setActiveCategory] = useState('url')
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

  const ActiveComponent = components[activeCategory]

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4">DevPlay</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
            />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {filteredCategories.map((category) => {
            const Icon = category.icon
            const isActive = activeCategory === category.id
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-left transition-all ${
                  isActive
                    ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? 'text-purple-600 dark:text-purple-400' : ''}`}
                />
                <span className="font-medium text-sm">{category.name}</span>
              </button>
            )
          })}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          >
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">{ActiveComponent && <ActiveComponent />}</div>
      </main>
    </div>
  )
}

export default Options
