import fs from 'node:fs'
import path from 'node:path'

interface SidebarItem {
  text: string
  link?: string
  items?: SidebarItem[]
  collapsed?: boolean
}

function getTitleFromFrontmatter(content: string): string | null {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/)
  if (!match) return null
  const fm = match[1]
  const titleMatch = fm.match(/^title:\s*["']?(.+?)["']?\s*$/m)
  return titleMatch ? titleMatch[1].trim() : null
}

function getLinkTitle(link: string, filePath: string): string {
  const name = path.basename(filePath, '.md')
  if (name === 'index') return null as unknown as string
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const frontmatterTitle = getTitleFromFrontmatter(content)
    if (frontmatterTitle) return frontmatterTitle
  } catch {}
  return name
}

function generateSidebarItems(dir: string, baseLink: string): SidebarItem[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  const folders: SidebarItem[] = []
  const files: SidebarItem[] = []

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue

    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      const subItems = generateSidebarItems(fullPath, `${baseLink}/${entry.name}`)
      if (subItems.length > 0) {
        folders.push({
          text: entry.name,
          collapsed: false,
          items: subItems,
        })
      }
    } else if (entry.name.endsWith('.md') && entry.name !== 'index.md') {
      const title = getLinkTitle(entry.name, fullPath)
      if (title) {
        files.push({
          text: title,
          link: `${baseLink}/${entry.name.replace(/\.md$/, '')}`,
        })
      }
    }
  }

  return [...folders, ...files]
}

export function autoSidebar(docsDir?: string): SidebarItem[] {
  const root = docsDir ?? path.resolve(__dirname, '..')
  return generateSidebarItems(root, '')
}

export function autoIndexMarkdown(docsDir?: string): string {
  const root = docsDir ?? path.resolve(__dirname, '..')
  const items = generateSidebarItems(root, '')

  function render(items: SidebarItem[], depth: number): string {
    const indent = '  '.repeat(depth)
    return items
      .map((item) => {
        if (item.link) {
          return `${indent}- [${item.text}](${item.link})`
        }
        if (item.items && item.items.length) {
          const children = render(item.items, depth + 1)
          const bullet = '  '.repeat(depth)
          return `${bullet}- **${item.text}**\n${children}`
        }
        return ''
      })
      .filter(Boolean)
      .join('\n')
  }

  return render(items, 0)
}
export const AUTO_INDEX_PLACEHOLDER = '<!--AUTO-SIDEBAR-INDEX-->'
