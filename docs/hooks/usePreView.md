---
outline: deep
---

# usePreView 预览图片

`usePreView` 是 uniapp 的 Hooks，用于获取当前图片预览。

## 基础用法

```tsx
import { usePreView } from 'dgb-hooks'

usePreView('https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png')
```

## 多张图片用法

```tsx

import { usePreView } from 'dgb-hooks'

// 第一种用法
usePreView([
  'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png', 
  'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'
]， {
  current: 1
})

// 第二种用法 
usePreView({
  urls: [
    'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png', 
    'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'
  ],
  current: 1
})

```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| img | 图片地址 | `string string[] UniNamespace.PreviewImageOptions` | - |
| options | 其他参数 | `Omit<UniNamespace.PreviewImageOptions, 'urls'>` | {} |


### 其他用法

参考 [uni.previewImage](https://uniapp.dcloud.net.cn/api/system/preview-image)

## 具体实现代码
::: details 源代码
```ts
const usePreView = (
  img: string | string[] | UniNamespace.PreviewImageOptions,
  options?: Omit<UniNamespace.PreviewImageOptions, 'urls'>,
) => {
  let option: UniNamespace.PreviewImageOptions = {
    urls: [],
  };
  if (typeof img === 'string') {
    const urls = img.split(',');
    option = {
      urls,
      ...options,
    };
  } else if (Array.isArray(img)) {
    option = {
      urls: img,
      ...options,
    };
  } else if (Object.prototype.toString.call(img) === '[object Object]') {
    option = img as UniNamespace.PreviewImageOptions;
  } else {
    throw new Error('参数传递有误');
  }
  uni.previewImage(option);
};

export default usePreView;
```

