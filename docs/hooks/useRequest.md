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


## 具体实现代码
::: details 源代码
```ts
import { ref, type Ref } from 'vue';
import { useDebounce, useThrottle } from '..';

interface RequestOptions<T, D> {
  manaul?: boolean; // 是否手动触发
  defaultParams?: D; // 默认参数
  debounceWait?: number; // 防抖时间
  cacheTime?: number; // 缓存时间
  cache?: boolean; // 是否缓存
  once?: boolean; // 是否执行一次
  retryCount?: number; // 重试次数
  retryDelay?: number; // 重试间隔
  isLoading?: boolean; // 是否显示loading
  throttleWait?: number; // 节流时间
  onBefore?: (params: D) => void; // 请求前
  onSuccess?: (data?: T, params?: D) => void; // 请求成功
  onError?: (error: Error, params?: D) => void; // 请求失败
  onFinally?: (
    cb?: (...rest: any[]) => void,
    params?: D,
    data?: T,
    error?: Error,
  ) => void; // 请求完成
}

interface RequestResult<T, P> {
  loading: Ref<boolean>; // 请求状态
  data?: Ref<T>;
  error?: Error;
  refresh: () => void; // 刷新

  run(params?: P, cb?: (...rest: any[]) => void): void; // 触发请求
}

/**
 * 封装请求
 * @param api 请求函数
 * @param options 配置项
 * @returns
 */
function useRequest<TData, TParams>(
  api: (res: TParams) => Promise<TData>,
  options: RequestOptions<TData, TParams> = {
    manaul: false,
    cache: true,
    cacheTime: 30000,
    defaultParams: {} as TParams,
    debounceWait: 0,
    throttleWait: 0,
    retryCount: 0,
    retryDelay: 3000,
    isLoading: true,
    once: false,
    onBefore: () => {},
    onSuccess: () => {},
    onError: () => {},
    onFinally: () => {},
  },
): RequestResult<TData, TParams> {
  const {
    onSuccess,
    onBefore,
    onError,
    onFinally,
    manaul,
    defaultParams = {} as TParams,
    debounceWait,
    cache,
    cacheTime,
    retryDelay,
    retryCount,
    throttleWait,
    isLoading,
    once,
  } = options || {};
  let o = false;
  let retry = 0;
  let isSuccess = false;
  let timer: number | null = null;
  const data = ref<TData | null>(null);
  const loading = ref(false);
  const paramsList = ref<TParams>(defaultParams);
  const errValue = ref<Error>();
  let run = async (params: TParams, cb?: (...rest: any[]) => void) => {
    if (once && o) {
      return;
    }
    if (cache && data.value) {
      if (!timer) {
        timer = setTimeout(() => {
          data.value = null;
          clearTimeout(timer as number);
        }, cacheTime);
      }
      return data.value;
    }
    paramsList.value = params || paramsList.value;
    onBefore?.(paramsList.value as TParams);
    loading.value = true;
    try {
      isLoading && uni && uni.showLoading();
      const res = await api(paramsList.value as TParams);
      isSuccess = true;
      // if
      data.value = res as TData;
      onSuccess?.(res);
      if (once) o = true;
    } catch (err) {
      errValue.value = err as Error;
      onError?.(err as Error, paramsList.value as TParams);
      if (!retryCount) return Promise.reject(err);
      setTimeout(() => {
        if (retry >= retryCount && !isSuccess) return;
        retry++;
        run(paramsList.value as TParams);
      }, retryDelay);
    } finally {
      isLoading && uni && uni.hideLoading();
      loading.value = false;
      onFinally?.(cb, paramsList.value as TParams, data.value as TData, errValue.value);
    }
  };
  const refresh = () => {
    run(paramsList.value as TParams);
  };
  if (debounceWait) {
    run = useDebounce(run, debounceWait) as (
      params: TParams,
      cb?: (...rest: any[]) => void,
    ) => Promise<TData>;
  }
  if (throttleWait) {
    run = useThrottle(run, throttleWait) as (
      params: TParams,
      cb?: (...rest: any[]) => void,
    ) => Promise<TData>;
  }
  if (!manaul) {
    run(defaultParams);
  }

  return {
    run,
    refresh,
    loading,
    // @ts-ignore
    data,
    error: errValue.value,
  };
}

export default useRequest;

```

