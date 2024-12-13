---
outline: deep
---

# useThrottle 节流

`useThrottle` 是 Vue 的 Hooks，用于节流。

## 基础用法

```tsx
import { useThrottle } from '@/hooks/useThrottle'

const throttle = useThrottle(fn, delay)
```

## 使用场景

- 滚动事件节流
- 窗口大小改变事件节流

::: tip
`useThrottle` 是参考 `lodash` 的 `throttle` 函数实现的。
具体用法可以参考 [lodash](https://lodash.com/docs/4.17.15#throttle)。
:::

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| fn | 需要节流的函数 | `(...args: any[]) => void` | - |
| delay | 节流时间 | `number` | 1000 |

## 具体实现代码
::: details 代码
```ts
const useThrottle = <T extends any[], D>(
  cb: (..._argv: T) => D,
  delay: number = 500,
): ((..._argv: T) => void) => {
  let timer: null | number = null;
  return (..._argv: T) => {
    if (timer) {
      return;
    }
    cb(..._argv);
    timer = setTimeout(() => {
      timer = null;
    }, delay);
  };
};
export default useThrottle;

```

