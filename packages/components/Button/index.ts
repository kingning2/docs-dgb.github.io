import { App } from 'vue'
import Button from './src/index.vue'

type SFCWithInstall<T> = T & { install(app: App): void }

Button.install = function(app: App) {
  app.component(Button.name as string, Button)
}

export default Button as SFCWithInstall<typeof Button> 