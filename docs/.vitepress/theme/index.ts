import DefaultTheme from 'vitepress/theme'
import Button from '../../../components/Button/button.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('admin-button', Button)
  }
}