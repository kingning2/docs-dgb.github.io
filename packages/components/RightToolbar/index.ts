import { App } from 'vue'
import RightToolbar from './src/index.vue'

type SFCWithInstall<T> = T & { install(app: App): void }

RightToolbar.install = function(app: App) {
    app.component(RightToolbar.name as string, RightToolbar)
}

export default RightToolbar as SFCWithInstall<typeof RightToolbar>