---
outline: deep
---

# useRequest 请求

`useRequest` 是一个强大的异步数据管理的 Hooks，项目中的网络请求场景使用 `useRequest` 就够了。

`useRequest` 通过插件式组织代码，核心代码极其简单，并且可以很方便的扩展出更高级的功能。目前已有能力包括：

- 请求错误重试
- 请求 loading 状态
- 请求成功或失败回调
- 请求成功数据处理
- 请求失败统一错误处理
- 请求防抖
- 请求节流
- 请求重刷
- ts类型支持

## 默认用法

对于简单的请求，直接使用 `useRequest` 即可。在 `onSuccess` 中处理成功后的逻辑。
返回的参数是调用的api返回的类型。

```tsx
import { useRequest } from 'dgb-ui/hooks'

const api = (params: { a: number; b: number }) => new Promise((resolve) => {
  setTimeout(() => {
    resolve('success')
  }, 1000)
})

useRequest(api, {
  defaultParams: {
    a: 1,
    b: 2
  },
  onSuccess(data) {
    console.log(data)
  }
})
```

## 手动调用

`useRequest` 返回的参数中包含 `run` 方法，可以手动调用请求。

`loading` 是请求的loading状态，`refresh` 是请求的刷新方法，`data` 是请求返回的数据，`error` 是请求返回的错误。

::: warning
手动调用时，需要配置 `manual: true`。
:::

```tsx
import { useRequest } from 'dgb-ui/hooks'

const api = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve('success')
  }, 1000)
})

const { run, loading, refresh, data, error } = useRequest(api, {
  manual: true,
  onSuccess(data) {
    console.log(data)
  }
})

run()
```

## 请求钩子

`useRequest` 提供了多个请求钩子，可以在请求的不同阶段执行不同的逻辑。

其中 `data` 是请求返回的数据，`error` 是请求返回的错误，`params` 是请求的参数。 `fn` 是run方法调用的第二个参数。

`onBefore` 在请求之前执行的逻辑。

`onSuccess` 在请求成功时执行的逻辑。

`onError` 在请求失败时执行的逻辑。

`onFinally` 在请求结束时执行的逻辑。

```tsx

const { run } = useRequest(api, {
  manual: true,
  onBefore(params) {
    console.log('onBefore')
  },
  onSuccess(data, params) {
    console.log('onSuccess', data)
  },
  onError(error, params) {
    console.log('onError', error)
  },
  onFinally(fn, params, data, error) {
    console.log('onFinally', fn, error, params, data)
  }
})

run({}, () => {
  console.log('无论成功或失败都会执行的函数')
})
```

## 错误重试

`retryCount` 是请求失败后重试的次数，`retryDelay` 是每次重试的间隔时间(默认3000ms)。

```tsx
useRequest(api, {
  retryCount: 3,
  retryDelay: 3000,
  onError(error) {
    console.log('onError', error)
  }
})
```

## 防抖和节流

`debounceWait` 是防抖时间，`throttleWait` 是节流时间。

```tsx
useRequest(api, {
  debounceWait: 1000,
  throttleWait: 1000,
  onSuccess(data) {
    console.log('1000ms内请求一次', data)
  }
})
```

## API

`useRequest` 的API如下：

### Return：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| run | 手动调用请求 | `(params?: any, fn?: () => void) => void` | - |
| loading | 请求的loading状态 | `boolean` | false |
| refresh | 请求的刷新方法 | `() => void` | - |
| data | 请求返回的数据 | `any` | - |
| error | 请求返回的错误 | `any` | - |

### Params：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| manual | 是否手动调用 | `boolean` | false |
| defaultParams | 默认请求参数 | `any` | - |
| cache | 是否缓存 | `boolean` | false |
| cacheTime | 缓存时间 | `number` | 0 |
| once | 是否只请求一次 | `boolean` | false |
| onBefore | 请求之前的回调 | `(params: any) => void` | - |
| onSuccess | 请求成功时的回调 | `(data: any, params: any) => void` | - |
| onError | 请求失败时的回调 | `(error: any, params: any) => void` | - |
| onFinally | 请求结束时的回调 | `(fn: () => void, params: any, data: any, error: any) => void` | - |
| retryCount | 请求失败后重试的次数 | `number` | 0 |
| retryDelay | 每次重试的间隔时间 | `number` | 3000 |
| debounceWait | 防抖时间 | `number` | 0 |
| throttleWait | 节流时间 | `number` | 0 |
