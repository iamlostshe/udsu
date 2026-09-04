import { defineConfig, type Plugin } from 'vitepress'
import { autoSidebar, autoIndexMarkdown, AUTO_INDEX_PLACEHOLDER } from './sidebar'

function autoIndexPlugin(): Plugin {
  return {
    name: 'vitepress-auto-index',
    enforce: 'pre',
    transform(code, id) {
      if (id.endsWith('index.md') && code.includes(AUTO_INDEX_PLACEHOLDER)) {
        return code.replace(AUTO_INDEX_PLACEHOLDER, autoIndexMarkdown())
      }
      return null
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
      '/': { base: '/', items: autoSidebar() },
    },
    lastUpdated: true,
  },
})
