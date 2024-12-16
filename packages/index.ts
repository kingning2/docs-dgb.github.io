import type { App, Component } from 'vue'

// 取出组件名字

const components: Record<string, Component> = import.meta.glob('./components/**/*.vue', {
  eager: true,
})

const componentsList: Component[] = []

Object.keys(components).forEach(key => {
  // @ts-ignore
  const com = (components[key as keyof typeof components]).default
  const name = `d-${key.split('/')[2]}`
  com.name = name
  com.install = function(app: App) {
    app.component(name as string, com)
  }
  componentsList.push(com)
})



// 组件库插件
const DgbUI = {
  install(app: App) {
    componentsList.forEach(component => {
      console.log(component);
      
      app.component(component.name as string, component)
    })
  }
}


export default DgbUI
