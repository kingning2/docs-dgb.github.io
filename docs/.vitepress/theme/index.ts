import DefaultTheme from 'vitepress/theme'

import 'vitepress-theme-demoblock/dist/theme/styles/index.css'
import { useComponents } from './useComponents'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import locale from 'element-plus/lib/locale/lang/zh-cn'
// 图标并进行全局注册
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import components from '../../../packages/index'
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(ElementPlus, {
      // locale // 语言设置
    })
    // 注册所有图标
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
    useComponents(app)

    // for (const [key, component] of Object.entries(components)) {
    //   app.component(key, component)
    // }

  }
}