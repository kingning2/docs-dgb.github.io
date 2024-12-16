import { demoBlockPlugin } from 'vitepress-theme-demoblock'
import { defineConfig } from 'vitepress'
import {
  guideSidebar,
  adminSidebar,
  miniSidebar,
  hooksSidebar,
  patchSidebar,
  pluginsSidebar,
} from './sidebar/index.mts'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '电攻邦-组件库',
  description: '跨项目使用的组件库',
  base: '/docs-dgb.github.io/',
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    [
      'link',
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    ],
    [
      'link',
      {
        href: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap',
        rel: 'stylesheet',
      },
    ],
  ],
  themeConfig: {
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/start' },
      { text: '后台组件', link: '/admin/overview' },
      { text: '小程序组件', link: '/mini/overview' },
      { text: 'API', link: '/hooks/useRequest' },
      { text: 'Vite插件', link: '/plugins/path-replace' },
      { text: '补丁', link: '/patch/uview' },
    ],

    // 侧边栏
    sidebar: {
      '/guide/': guideSidebar,
      '/admin/': adminSidebar,
      '/mini/': miniSidebar,
      '/hooks/': hooksSidebar,
      '/patch/': patchSidebar,
      '/plugins/': pluginsSidebar,
    },

    // 项目地址
    socialLinks: [
      { icon: 'github', link: 'https://github.com/kingning2?tab=repositories' },
    ],
    footer: {
      message: '作者: coisini',
      // copyright: ''
    },
    search: {
      provider: 'local',
    },
    lastUpdated: {
      text: '最后更新时间',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium',
      },
    },
  },
  ignoreDeadLinks: [
    // 忽略精确网址 "/playground"
    '/playground',
    // 忽略所有 localhost 链接
    /^https?:\/\/localhost/,
    // 忽略所有包含 "/repl/" 的链接
    /\/repl\//,
    // 自定义函数，忽略所有包含 "ignore "的链接
    (url) => {
      return url.toLowerCase().includes('ignore')
    },
  ],
  markdown: {
    config: (md) => {
      md.use(demoBlockPlugin)
    }
  },
})
