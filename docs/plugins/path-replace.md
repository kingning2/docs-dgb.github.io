---
outline: deep
---

# 路径自动替换

## 功能

- 自动替换代码中指定规则的路径

## 使用

```ts
import { VitePluginImgConversion } from 'vite-plugin-dgb';

export default {
  ...
  // /static/icon/logo.png => https://baidu.com/icon/logo.png
  plugins: [
    VitePluginImgConversion({
      path: 'https://baidu.com',
      rule: /['"`]\/static\//gi
    })
  ],
};
```

- `path`: 替换路径
- `rule`: 匹配规则 默认 `['"]\/static\//gi`

## 具体代码

::: details 代码

```ts
import { Plugin } from 'vite';
import { filesPath } from './utils';

interface PluginOptions {
  /**
   * 替换路径
   */
  path: `http${'s' | never}://${string}`;
  /**
   * 匹配规则
   */
  rule: RegExp | string
}

const ImgPathConversion = ({ 
  path,
  rule = /['"`]\/static\//gi
 }: PluginOptions): Plugin => {
  return {
    name: 'img-path-conversion',
    transform(code, id) {
      let newCode = code;
      if (filesPath(id, 'vue|ts')) {
        // @ts-ignore
        newCode = code.replaceAll(rule, (res: string) => {
          return res[0] + path;
        });
      }
      return {
        code: newCode,
        map: null,
      };
    },
  };
};

export default ImgPathConversion;

```

:::
