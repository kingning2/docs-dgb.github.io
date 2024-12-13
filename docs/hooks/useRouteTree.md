---
outline: deep
---

# useRouteTree 构建路由树

`useRouteTree` 是 uniapp 的 Hooks，用于构建pages.json中的路由树。

::: warning
需要在App.vue中调用，从而初始化路由。
需要遵循一定的规则。
1. 在主包中的页面需要以 `index` 结尾为第一层
2. 需要使用 `pagesPackage` 作为主页的包名
3. 需要使用 `pagesWorkPackage` 作为工作台的包名
4. 需要使用 `pagesUserPackage` 作为用户的包名
5. 需要使用 `pagesDetailPackage` 作为详情页的包名
6. 分包 `pagesDetailPackage` 中使用 `use` 字段对应所使用的页面
:::

## 基础用法

```tsx
import { useRouteTree } from 'dgb-hooks'

useRouteTree() // 直接调用即可构建路由树
```

## 获取当前页面路由对象

```tsx
import { useRouteTree } from 'dgb-hooks'

useRouteTree.getNowRoute('pages/home/index') // 获取当前页面路由对象
// {
//   path: 'pages/home/index';
//   title: '主页';
//   isIndex: true;
//   key: 'home';
//   leave: 0;
//   lastPath: '';
//   children: [];
// }
useRouteTree.getNowRoute('pages/home/test') // 获取当前页面路由对象
// {
//   path: 'pages/home/test';
//   title: '主页';
//   isIndex: true;
//   key: 'home';
//   leave: 1;
//   lastPath: 'pages/home/index';
//   children: [];
// }
```

## API

### 参数

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 路由路径 | `pages${string}` | - |
| key | 路由对象的属性 | `keyof Omit<Route, 'children'>` | `path` |
| route | 路由对象 | `Route[]` | - |

### Route

| 返回值 | 说明 | 类型 |
| --- | --- | --- |
| path | 路由路径 | `string` | - |
| title | 路由对象的属性 | `string` | `path` |
| isIndex | 是否为tarbar页面 | `boolean` | - |
| key | 路由key | `string` | - |
| leave | 在第几层 | `number` | - |
| lastPath | 上一层路由 | `string` | - |
| children | 子路由 | `Route[]` | - |

## 具体实现代码
::: details 代码
```ts
import UNIPAGE from '@/pages.json';
import type { TabbarKey } from '@/types/context';

interface Route {
  path: string; // 当前页面路由
  title: string; // 路由标题
  isIndex: boolean; // 是否为tarbar页面
  key: string; // 路由key
  leave: number; // 在第几层
  lastPath: string; // 上一层路由
  children?: Route[]; // 子路由
}

interface IUseRouteTree {
  getNowRoute: (
    value: `pages${string}`,
    key?: keyof Omit<Route, 'children'>,
    route?: Route[],
  ) => Route | void;

  (): Promise<Route[]>;
}

const tabbar: `pages/${TabbarKey}/index`[] = [
  'pages/home/index',
  'pages/wantlease/index',
  'pages/user/index',
  'pages/work/index',
  'pages/square/index',
  'pages/orders/index',
];

const subRouteMap = {
  work: 'pagesWorkPackage',
  user: 'pagesUserPackage',
  home: 'pagesPackage',
};

let r: Route[] = [];

const createRoute = (
  pages: typeof UNIPAGE.pages,
  routes: Route[] = [],
  leave: number = 0,
  lastPath: string = '',
) => {
  let i = 0;
  while (i < pages.length) {
    const page = pages[i++];
    const key = page.path.split('/')[1];
    const obj: Route = {
      path: page.path,
      key,
      title: (page.style.navigationBarTitleText as string) || '',
      leave,
      lastPath,
      isIndex: tabbar.includes(page.path as `pages/${TabbarKey}/index`),
      children: [],
    };
    if (page.path.includes('index')) {
      routes.push(obj);
      const subPackageName = subRouteMap[key as keyof typeof subRouteMap];
      // 工作台和用户的页面
      if (subPackageName) {
        const subPages = UNIPAGE.subPackages
          .find((i) => i.root === subPackageName)
          ?.pages.map((i) => ({ ...i, path: `${subPackageName}/${i.path}` }));
        if (subPages) {
          createRoute(
            subPages as typeof UNIPAGE.pages,
            obj.children,
            obj.leave + 1,
            obj.path,
          );
        }
      }
      continue;
    }
    setTimeout(() => {
      // 采购特殊处理
      if (key === 'procurement') {
        obj.key = key + obj.path.split('/')[2];
        routes.push(obj);
        return;
      }
      const parent = routes.find((item) => item.key === key);
      if (parent) {
        obj.leave = parent.leave + 1;
        obj.lastPath = parent.path;
        parent.children?.push(obj);
      }
    }, 0);
  }
};

// 获取对应的路由
const findRoute: IUseRouteTree['getNowRoute'] = (
  value,
  key = 'path',
  route = r,
) => {
  if (route.length === 0) return;
  let i = 0;
  while (i < route.length) {
    const item = route[i++];
    if (item[key] === value) {
      return item;
    }
    const r = findRoute(value, key, item.children!);
    if (r) {
      return r;
    }
  }
};

// 将详情页面分类
const findDetailParent = (routes: Route[], pages: any[]) => {
  const unFindRoute = {};
  let i = 0;
  while (i < pages.length) {
    const page = pages[i++];
    const key = page.path.split('/')[1];
    let j = 0;
    while (j < page.use.length) {
      j++;
      const now = page.use.shift();
      const parent = findRoute(now, 'title', routes);
      if (!parent) {
        // @ts-ignore
        unFindRoute[page.path] = page;
        continue;
      }
      const obj: Route = {
        path: page.path,
        key,
        title: (page.style.navigationBarTitleText as string) || '',
        leave: parent.leave + 1,
        lastPath: parent.path,
        isIndex: tabbar.includes(page.path as `pages/${TabbarKey}/index`),
        children: [],
      };
      parent.children?.push(obj);
    }
  }
  return unFindRoute;
};

// 构建路由树
const useRouteTree: IUseRouteTree = () =>
  new Promise((resolve) => {
    r = [];
    createRoute(UNIPAGE.pages, r, 0, '');
    const list = UNIPAGE.subPackages
      .find((i) => i.root === 'pagesDetailPackage')!
      .pages.map((i) => ({
        ...i,
        path: `pagesDetailPackage/${i.path}`,
      })) as any;
    setTimeout(() => {
      findDetailParent(r, list);
      resolve(r);
    });
  });

useRouteTree.getNowRoute = findRoute;

export default useRouteTree;

```
