import { defineConfig } from 'vitepress'
import { guideSidebar, adminSidebar, miniSidebar, hooksSidebar } from './sidebar/index.mts'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "电攻邦-组件库",
  description: "跨项目使用的组件库",
  base: '/docs-dgb.github.io/', 
  themeConfig: {
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/start' },
      { text: '后台组件', link: '/admin/overview' },
      { text: '小程序组件', link: '/mini/overview' },
      { text: 'API', link: '/hooks/useRequest' },
    ],

    // 侧边栏
    sidebar: {
      '/guide/': guideSidebar,
      '/admin/': adminSidebar,
      '/mini/': miniSidebar,
      '/hooks/': hooksSidebar,
    },

    // 项目地址
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    footer: {
      message: '作者: coisini',
      copyright: 'Copyright 深圳电攻邦能源科技有限公司版权所有 2024 粤ICP备2024310874号-1'
    },
    search: {
      provider: 'local'
    },
    lastUpdated: {
      text: '最后更新时间',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    }
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
    }
  ]
})
