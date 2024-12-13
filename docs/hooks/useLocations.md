---
outline: deep
---

# useLocations 用户拒绝后重新获取定位

`useLocations` 是 uniapp 的 Hooks，用于在用户拒绝后重新引导用户获取定位。

::: tip
只有在用户拒绝后才会触发对应的函数。
:::

## 基础用法

```tsx
import { useLocations } from 'dgb-hooks'

const refetch = () => {
  console.log('重新获取定位')
}

await useLocations() // 用户拒绝后则返回错误响应
refetch() // 用户拒绝后则重新获取定位
```

## 传递参数

```tsx
import { useLocations } from 'dgb-hooks'

const refetch = () => {
  console.log('重新获取定位')
}
await useLocations(refetch) // 在成功之后会自带调用 refetch 函数
```

## API

### 参数

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| successCallBack | 用户授权成功回调 | `() => void` | - |

## 具体实现代码

::: details 代码
```ts
/**
 * 获取用户位置信息
 * @param successCallBack 成功回调
 * @return Promise<boolean>
 */
const useLocations = (successCallBack?: () => void): Promise<boolean> =>
  new Promise((resolve, reject) => {
    uni.getSetting({
      withSubscriptions: true,
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          return resolve(true);
        }
        successModal(successCallBack, resolve, reject);
      },
    });
  });

// 授权成功回调
const successModal = (
  successCallBack?: () => void,
  // @ts-ignore
  resolve: (value: boolean | PromiseLike<boolean>) => void,
  reject: (reason?: any) => void,
) => {
  uni.showModal({
    title: '请求授权当前位置',
    content: '需要获取您的地理位置，请确认授权',
    success: function (re) {
      if (!re.confirm) {
        return reject(false);
      }
      uni.openSetting({
        success(result) {
          if (result.authSetting['scope.userLocation']) {
            successCallBack?.();
            resolve(true);
          }
          reject(false);
        },
      });
    },
  });
};
export default useLocations;

```
:::
