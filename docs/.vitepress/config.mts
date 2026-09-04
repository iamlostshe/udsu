import { defineConfig } from 'vitepress'
import { autoSidebar } from './sidebar'

export default defineConfig({
  title: 'UDSU',
  description: 'Documentation',
  themeConfig: {
    sidebar: autoSidebar(),
    lastUpdated: true,
  },
})
