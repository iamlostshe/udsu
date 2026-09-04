import { defineConfig, type Plugin } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { autoSidebar, autoIndexMarkdown } from './sidebar'

const INDEX_HEADER = `## udsu

## Содержание

`

function autoIndexPlugin(): Plugin {
  return {
    name: 'vitepress-auto-index',
    enforce: 'pre',
    buildStart() {
      const indexPath = path.resolve(__dirname, '../index.md')
      fs.writeFileSync(indexPath, INDEX_HEADER + autoIndexMarkdown() + '\n')
    },
  }
}

export default defineConfig({
  title: 'udsu',
  description: 'Documentation',
  vite: {
    plugins: [autoIndexPlugin()],
  },
  themeConfig: {
    sidebar: {
      '/': { items: autoSidebar() },
    },
    lastUpdated: true,
  },
})
