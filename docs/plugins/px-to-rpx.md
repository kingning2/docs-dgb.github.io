---
outline: deep
---

# px转rpx

## 功能

- 自动将代码中的px转换为rpx

::: warning
- 行内样式不转换
:::

## 使用

```ts
import { VitePluginPxToRpx } from 'vite-plugin-dgb';

export default {
  ...
  // /static/icon/logo.png => https://baidu.com/icon/logo.png
  plugins: [
    VitePluginPxToRpx()
  ],
};
```

- `designWidth`: 设计稿宽度 默认 375
- `unit`: 转换单位 默认 rpx

## 具体代码

::: details 代码

```ts
import { Plugin } from 'vite';
import { filesPath } from './utils';

const transform = (
  value: string,
  options: {
    // 设计稿宽度
    designWidth: number;
    // 转换单位
    unit: string;
  },
) => {
  const magnification = options.designWidth / 750;
  const reg = /(:|: )+(\d)+(px)/gi;
  const first = value.replace(reg, function (_x) {
    const new_x = _x.replace(/(:|: )/, '').replace(/px/i, '');
    return ':' + parseFloat(new_x) / magnification + options.unit;
  });
  const sec = first?.replace(/( )+(\d)+(px)/gi, function (text) {
    return ` ${parseFloat(text) / magnification + options.unit}`;
  });
  const res = sec?.replace(/(-)+(\d)+(px)/gi, function (text) {
    return `${parseFloat(text) / magnification + options.unit}`;
  });
  return res;
};

const VitePluginPxToRpx = (
  options = {
    // 设计稿宽度
    designWidth: 375,
    // 转换单位
    unit: 'rpx',
  },
): Plugin => {
  return {
    name: 'vite-plugin-px-to-rpx',
    transform(code, id) {
      let newCode = code;
      if (filesPath(id, 'vue|scss|css')) {
        newCode = transform(newCode, options);
      }
      return {
        code: newCode,
        map: null,
      };
    },
  };
};
export default VitePluginPxToRpx;

```

:::
