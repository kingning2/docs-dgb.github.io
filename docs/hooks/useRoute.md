---
outline: deep
---

# useRoute 路由

`useRoute` 是 uniapp 的 Hooks，用于获取当前路由。

::: warning
必须在 `onMounted` 中使用，否则获取不到数据。
:::

## 基础用法

```tsx
import { useRoute, useEffect } from 'dgb-hooks'

const route = useRoute<{
  title: string
}>()


useEffect(() => {
  // pages/index/index?title=123
  console.log(route.query.value.title)  // 123
  console.log(route.route)  // pages/index/index
}, [])
```

## 具体实现代码
::: details 源代码
```ts
import { ref, type Ref } from 'vue';
import useEffect from './useEffect';
interface RouteResult<T> extends Page.PageInstance<AnyObject, {}> {
  query: Ref<T>;
  history: Ref<string | undefined>;
  page: any[];
}
const useRoute = <T>(): RouteResult<T> => {
  const query = ref<T>({} as T);
  const history = ref();
  const page = getCurrentPages();
  useEffect(() => {
    // @ts-ignore
    query.value = page[page.length - 1].options;
    history.value = page[page.length - 2]?.route;
  }, []);
  return {
    // @ts-ignore
    query,
    page,
    history,
    ...page[page.length - 1],
  };
};

export default useRoute;


```

