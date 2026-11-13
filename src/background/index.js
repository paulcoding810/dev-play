import { matchCategories } from '../data/categories'

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason !== 'install') {
    return
  }
  chrome.runtime.openOptionsPage()
})

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage()
})

const DEFAULT_SUGGESTION = 'Open Dev Play'

chrome.omnibox.setDefaultSuggestion({ description: DEFAULT_SUGGESTION })
chrome.omnibox.onInputChanged.addListener((input, suggest) => {
  const [best, ...rest] = input.trim() ? matchCategories(input) : []
  chrome.omnibox.setDefaultSuggestion({
    description: best ? `Open ${best.name}` : DEFAULT_SUGGESTION,
  })
  suggest(rest.map(({ id, name }) => ({ content: id, description: name })))
})
chrome.omnibox.onInputEntered.addListener((input, disposition) => {
  const resolvedCategory = input.trim() ? matchCategories(input)[0]?.id : undefined

  const url = `${chrome.runtime.getURL('options.html')}?category=${resolvedCategory ?? 'url'}`

  switch (disposition) {
    case 'currentTab':
      chrome.tabs.update({ url })
      break
    case 'newForegroundTab':
      chrome.tabs.create({ url })
      break
    case 'newBackgroundTab':
      chrome.tabs.create({ url, active: false })
      break
  }
})
