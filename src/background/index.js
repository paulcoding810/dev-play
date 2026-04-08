import { categories } from '../data/categories'

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason !== 'install') {
    return
  }
  chrome.runtime.openOptionsPage()
})

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage()
})

chrome.omnibox.setDefaultSuggestion({ description: 'Open Dev Play' })
chrome.omnibox.onInputChanged.addListener((input, suggest) => {
  suggest(getMatchingProperties(input))
})
chrome.omnibox.onInputEntered.addListener((category, disposition) => {
  const resolvedCategory = categories[category]
    ? category
    : categories.find(({ id }) => id.match(new RegExp(category, 'gi')))?.id

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

function getMatchingProperties(input) {
  const result = []
  for (const category of categories) {
    if (category.id.startsWith(input)) {
      const suggestion = {
        content: category.id,
        description: category.name,
      }
      result.push(suggestion)
    } else if (result.length !== 0) {
      return result
    }
  }
  return result
}
