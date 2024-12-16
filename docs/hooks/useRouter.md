---
outline: deep
---

# useRouter 路由

`useRouter` 是 uniapp 的 Hooks，用于跳转页面。

## 基础用法

```tsx
import { useRouter } from 'dgb-hooks'

const router = useRouter()

// 第一种用法
router.push('/pages/index/index'， {
  params: {
    title: '123'
  }
}) // 跳转页面

// 第二种用法
router.replace({
  url: '/pages/index/index',
  params: {
    title: '123'
  }
}) // 替换页面

router.switchTab('/pages/index/index', {
  params: {
    title: '123'
  }
}) // 切换tabbar页面

router.back() // 返回
```
## 返回方法

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| push | 跳转页面 | `(url: RouterType, params: ParamsType = {}) => void` | - |
| back | 返回 | `(delta: number = 1) => void` | - |
| replace | 替换页面 | `(url: RouterType, params: ParamsType = {}) => void` | - |
| switchTab | 切换tabbar页面 | `(url: RouterType, params: ParamsType = {}) => void` | - |


### 其他用法

参考 [uni 页面和路由](https://uniapp.dcloud.net.cn/api/router)

## 具体实现代码
::: details 源代码
```ts
type ParamsType =
  | {
      [key in string]: any;
    }
  | string
  | any[];
type RouterType =
  | string
  | {
      url: string;
      params?: ParamsType;
    };
/**
 * 将对象转成url参数
 */
const objToUrlParams = (obj: ParamsType) => {
  if (typeof obj === 'string') return obj;
  let params = '';
  if (Array.isArray(obj)) {
    let i = 0;
    while (i < obj.length) {
      params += `${i}=${obj[i++]}&`;
    }
    return params.substring(0, params.length - 1);
  }
  for (const key in obj) {
    if (!obj[key] && obj[key] !== 0) continue;
    params += `${key}=${obj[key]}&`;
  }
  params = params.substring(0, params.length - 1);
  return params;
};

const nav = (
  name: 'navigateTo' | 'redirectTo' | 'reLaunch',
  url: RouterType,
  params: ParamsType = '',
) => {
  if (typeof url === 'string') {
    objToUrlParams(params);
    // @ts-ignore
    uni[name]({
      url: `${url}?${objToUrlParams(params)}`,
    });
    return;
  }
  const p = url.params && objToUrlParams(url.params);
  // @ts-ignore
  uni[name]({
    url: p ? `${url.url}?${p}` : `${url.url}`,
  });
};

const useRouter = () => {
  return {
    // 跳转
    push: (url: RouterType, params: ParamsType = '') =>
      nav('navigateTo', url, params),
    // 返回
    back: (delta: number = 1) => {
      uni.navigateBack({
        delta,
      });
    },

    // 关闭当前页面
    replace: (url: RouterType, params: ParamsType = '') =>
      nav('redirectTo', url, params),
    // 回到tabbar页面
    switchTab: (url: RouterType, params: ParamsType = '') =>
      nav('reLaunch', url, params),
  };
};

export default useRouter;
```

