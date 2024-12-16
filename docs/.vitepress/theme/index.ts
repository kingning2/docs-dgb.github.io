import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import 'vitepress-theme-demoblock/dist/theme/styles/index.css'
import { useComponents } from './useComponents'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import DgbUI from '../../../packages'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(ElementPlus)
    
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {      
      app.component(key, component)
    }
    
    useComponents(app)
    app.use(DgbUI)
  }
} as Theme