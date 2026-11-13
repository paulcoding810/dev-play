const categories = [
  { id: 'url', name: 'URL Tools', keywords: ['encode', 'decode', 'uri', 'percent', 'query'] },
  { id: 'qrcode', name: 'QR Code', keywords: ['barcode', 'scan'] },
  {
    id: 'base64',
    name: 'Base64 / JWT',
    keywords: ['encode', 'decode', 'base64url', 'jwt', 'token', 'atob', 'btoa'],
  },
  {
    id: 'json',
    name: 'JSON Tools',
    keywords: ['xml', 'format', 'prettify', 'beautify', 'minify', 'repair', 'tree', 'path'],
  },
  { id: 'mermaid', name: 'Mermaid Tools', keywords: ['diagram', 'chart', 'flowchart', 'graph'] },
  { id: 'text', name: 'Text Tools', keywords: ['case', 'upper', 'lower', 'trim', 'count'] },
  { id: 'regex', name: 'Regex Tester', keywords: ['regexp', 'pattern', 'match', 'replace'] },
  {
    id: 'hash',
    name: 'Hash Generator',
    keywords: ['sha', 'sha1', 'sha256', 'sha512', 'md5', 'digest', 'checksum'],
  },
  {
    id: 'timestamp',
    name: 'Timestamp / Date',
    keywords: ['epoch', 'unix', 'time', 'iso', 'utc', 'timezone'],
  },
  {
    id: 'number',
    name: 'Hex / Dec / Binary',
    keywords: ['hex', 'decimal', 'binary', 'octal', 'radix', 'base', 'convert'],
  },
  { id: 'color', name: 'Color Tools', keywords: ['rgb', 'hsl', 'hex', 'picker', 'palette'] },
]

const matchCategories = (query) => {
  const q = query.trim().toLowerCase()
  if (!q) return categories
  const nameMatches = categories.filter(
    ({ id, name }) => id.startsWith(q) || name.toLowerCase().includes(q),
  )
  const keywordMatches = categories.filter(
    (cat) => !nameMatches.includes(cat) && cat.keywords.some((k) => k.startsWith(q)),
  )
  return [...nameMatches, ...keywordMatches]
}

export { categories, matchCategories }
