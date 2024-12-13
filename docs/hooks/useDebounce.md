---
outline: deep
---

# useDebounce 防抖

`useDebounce` 是 Vue 的 Hooks，用于防抖。

## 基础用法

```tsx
import { useDebounce } from '@/hooks/useDebounce'

const debounce = useDebounce(fn, delay)
```

## 使用场景

- 搜索框输入防抖
- 表单验证防抖

::: tip
`useDebounce` 是参考 `lodash` 的 `debounce` 函数实现的。
具体用法可以参考 [lodash](https://lodash.com/docs/4.17.15#debounce)。
:::

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| fn | 需要防抖的函数 | `(...args: any[]) => void` | - |
| delay | 防抖时间 | `number` | 1000 |

## 具体实现代码
::: details 代码

```ts
/* eslint-disable no-unused-vars */
const useDebounce = <T extends any[], D>(
  cb: (..._argv: T) => D,
  delay: number = 500,
): ((..._argv: T) => void) => {
  let timer: null | number = null;
  return (..._argv: T) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      return cb(..._argv);
    }, delay);
  };
};
export default useDebounce;

```
:::

