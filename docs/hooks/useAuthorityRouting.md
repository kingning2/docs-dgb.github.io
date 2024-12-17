---
outline: deep
---

# useAuthorityRouting 动态获取指定地址下的路由

`useAuthorityRouting` 是 Vue-Route 的 Hooks，用于动态生成路由。

::: warning
基于ruoyi框架的路由，必须放在指定文件夹下才可以生效
`@/Controller/**/*.vue`
:::

## 基础用法

```tsx
// 父组件
// 传递路由对象自动进行注册
useAuthorityRouting(route)
```

## 使用场景

- 自动化注册路由

## API

| 参数          | 说明     | 类型                                 | 默认值 |
| ------------- | -------- | ------------------------------------ | ------ |
| useAuthorityRouting | 传递事件 | `(route: Route) => Route` | -      |

## Route
| 参数          | 说明     | 类型                                 | 默认值 |
| ------------- | -------- | ------------------------------------ | ------ |
| name | 路由名字 | `string` | -      |
| path | 路由路劲 | `string` | -      |
| hidden | 是否隐藏 | `boolean` | false    |
| permissions | 权限 | `string string[]` | -      |
| component | 组件 | `Componen` | -      |
| children | 子组件 | `Route[]` | -      |

## 具体实现代码

::: details 源代码

```ts
import Layout from '@/layout'
/**
 * 动态控制本地路由注册
 */
const useAuthorityRouting = (routes) => {
  // 获取 Controller 下的 vue 文件
  const newRouters = [...routes]
  const AuthorityRoute = import.meta.glob(['@/Controller/**/*.vue'], {
    eager: true,
    import: 'default',
  })
  for (const routeElement of Object.entries(AuthorityRoute)) {
    const [paths, component] = routeElement
    const p = paths.replace(/\/src\/Controller\/(.*)\/(.*)\.vue/, '/$1/$2')
    const parrenntPath = p.split('/')
    const childrenPath = parrenntPath.splice(parrenntPath.length - 1, 1)
    // 判断之前是否存在过
    const old = newRouters.find((item) => item.path === parrenntPath.join('/'))
    if (old) {
      old.children.push({
        path: childrenPath[0],
        component,
        name: 'text',
      })
      continue
    }
    newRouters.push({
      path: parrenntPath.join('/'),
      hidden: true,
      component: Layout,
      permissions: [p.substring(1).replaceAll('/', ':')],
      children: [
        {
          path: childrenPath[0],
          component,
          name: parrenntPath[2],
        },
      ],
    })
  }
  return newRouters
}

export default useAuthorityRouting
```
