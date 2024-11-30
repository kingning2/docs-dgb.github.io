---
outline: deep
---

# useEffect 生命周期

`useEffect` 是 React 的 Hooks，用于在函数组件中执行副作用操作。

在vue3中，`useEffect` 的用法与 React 类似，但有一些区别。

::: tip
在有依赖值时，默认不会执行，依赖性有数据变化时，`useEffect` 才会执行。
:::

## 基础用法

在生命周期中，`useEffect` 可以用于在组件挂载、更新或卸载时执行副作用操作。

```tsx
import { useEffect } from 'vue'

useEffect(() => {
  console.log('副作用操作')
}, [])
```

## 依赖项

`useEffect` 的第二个参数是一个数组，用于指定依赖项。当依赖项发生变化时，`useEffect` 会重新执行。

::: tip
实现原理是利用 `watch` 监听依赖项的变化，当依赖项发生变化时，`useEffect` 会重新执行。
生命周期则是利用 `onMounted`、`onUpdated`、`onUnmounted` 等生命周期钩子来实现的。

监听的依赖项必须是响应式数据。
:::

```tsx
const test = ref(0)

useEffect(() => {
  console.log('副作用操作', test.value) // 执行一次 test: 2
}, [test])

test.value = 2
```

## 返回值

`useEffect` 可以返回一个函数，用于在组件卸载时执行清理操作。

```tsx
useEffect(() => {
  console.log('副作用操作')
  return () => {
    console.log('清理操作')
  }
}, [])
```

## 第三个参数

`useEffect` 的第三个参数是一个配置项。

- mount: 是否在组件挂载时执行

```tsx
const test = ref(0)

useEffect(() => {
  console.log('副作用操作', test.value) // 执行两次 test: 0 -> test: 2
}, [test], {
  mount: true
})

test.value = 2
```

## API

### 参数

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| deps | 依赖项(必须是响应式数据) | `any[]` | - |
| options | 配置项 | `option` | - |

### option 配置项

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| mount | 是否在组件挂载时执行 | `boolean` | `false` |

### 其他用法

参考 [React useEffect](https://react.dev/reference/react/useEffect)
