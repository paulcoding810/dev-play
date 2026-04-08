---
name: Theme Toggle
description: Add dark/light theme toggle to React apps with Tailwind CSS
triggers:
  - 'add dark mode'
  - 'add theme toggle'
  - 'dark/light mode'
  - 'toggle theme'
  - 'dark mode toggle'
---

# Theme Toggle Skill

Add dark/light mode toggle to React + Tailwind CSS applications.

## Setup

### 1. Tailwind Config

```js
export default {
  darkMode: 'class',
  // ...
}
```

### 2. Component Implementation

```jsx
import { useState, useEffect } from 'react'

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'light' : 'dark')
  }

  return <button onClick={toggleTheme}>{isDark ? 'Light Mode' : 'Dark Mode'}</button>
}
```

### 3. Button Styles

```jsx
<button
  onClick={toggleTheme}
  className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-600 transition-all hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
>
  {isDark ? 'Light Mode' : 'Dark Mode'}
</button>
```

## Tailwind Dark Mode Classes

| Element      | Light Mode          | Dark Mode                |
| ------------ | ------------------- | ------------------------ |
| Background   | `bg-gray-50`        | `dark:bg-gray-900`       |
| Card         | `bg-white`          | `dark:bg-gray-800`       |
| Border       | `border-gray-200`   | `dark:border-gray-700`   |
| Primary text | `text-gray-900`     | `dark:text-gray-100`     |
| Muted text   | `text-gray-500`     | `dark:text-gray-400`     |
| Input BG     | `bg-white`          | `dark:bg-gray-800`       |
| Sidebar      | `bg-white`          | `dark:bg-gray-800`       |
| Hover        | `hover:bg-gray-100` | `dark:hover:bg-gray-700` |
| Active       | `bg-purple-100`     | `dark:bg-purple-900/50`  |

## CSS Component Classes

Add to `index.css`:

```css
@layer components {
  .input-field {
    @apply w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100;
  }

  .card {
    @apply rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800;
  }
}
```
