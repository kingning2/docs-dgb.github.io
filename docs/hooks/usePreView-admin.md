---
outline: deep
---

# usePreView 预览图片

`usePreView` 是 vue 的 Hooks，用于获取当前图片预览。

:::warning 注意
项目必须支持tsx写法才能使用
:::

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
| img | 图片地址 | `string string[] Options` | - |
| options | 其他参数 | `Options` | {} |


## Options
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| urls | 图片地址 | `string string[]` | - |
| hideOnClickModal | 点击遮罩层是否能关闭 | `boolean` | {} |

## 具体实现代码
::: details 源代码
```tsx
import { createApp, ref } from "vue";
import { ElIcon, ElImage, ElTooltip } from "element-plus";
import { ArrowLeftBold, ArrowRightBold, Close } from "@element-plus/icons-vue";
// @ts-ignore
import styles from "./usePreView.module.scss";
import useThrottle from "./useThrottle";

interface Options {
  urls: string | string[];
  hideOnClickModal?: boolean;
}

const scale = ref(1);
const left = ref(0);
const top = ref(0);
const rotate = ref(0);

const dom = {
  props: {
    urls: {
      type: [String, Array],
    },
    close: {
      type: Function,
    },
  },
  render(ctx) {
    const { urls, close } = ctx.$props;
    return (
      <div class={styles.container}>
        <ElImage
          style={`
            height: 80%;
            transform: 
            scale(${scale.value}) 
            translate(${left.value}px,${top.value}px)
            rotate(${rotate.value}deg);
          `}
          src={urls[0]}
          fit="cover"
          initialIndex={4}
        />
        <div class={styles.close} onClick={close}>
          <ElIcon>
            <Close />
          </ElIcon>
        </div>
        <div class={styles.edit}>
          <ElTooltip
            effect="dark"
            placement="bottom-start"
            content="向左旋转90°"
          >
            <div class={styles.tooltip} onClick={() => (rotate.value -= 90)}>
              <ElIcon>
                <ArrowLeftBold />
              </ElIcon>
            </div>
          </ElTooltip>
          <ElTooltip
            class={styles.tooltip}
            effect="dark"
            placement="bottom-start"
            content="向右旋转90°"
          >
            <div class={styles.tooltip} onClick={() => (rotate.value += 90)}>
              <ElIcon>
                <ArrowRightBold />
              </ElIcon>
            </div>
          </ElTooltip>
        </div>
      </div>
    );
  },
};

const usePreView = (img: string | string[] | Options, options?: Options) => {
  let option: Options = {
    urls: "",
  };
  if (typeof img === "string") {
    const urls = img.split(",");
    option = {
      urls,
      ...options,
    };
  } else if (Array.isArray(img)) {
    option = {
      urls: img,
      ...options,
    };
  } else if (Object.prototype.toString.call(img) === "[object Object]") {
    option = img as Options;
  } else {
    throw new Error("参数传递有误");
  }
  const div = document.createElement("div");
  const { hideOnClickModal = false, ...res } = option;
  const close = () => {
    app.unmount();
    document.body.removeChild(div);
    scale.value = 1;
    left.value = 0;
    top.value = 0;
    rotate.value = 0;
  };
  const app = createApp(dom, {
    ...res,
    onclick(e) {
      if (e.target.className === styles.container && hideOnClickModal) {
        close();
      }
    },
    close,
    onwheel(e) {
      if (e.wheelDelta > 0) {
        scale.value += 0.05;
      } else {
        scale.value -= 0.05;
      }
    },
    onmousedown(e: MouseEvent) {
      const oldValueX = left.value;
      const oldValueY = top.value;
      const startX = e.pageX;
      const startY = e.pageY;
      div.onmousemove = useThrottle((event: MouseEvent) => {
        left.value = (oldValueX + event.pageX - startX) / scale.value;
        top.value = (oldValueY + event.pageY - startY) / scale.value;
      }, 15);
      div.onmouseup = () => {
        div.onmousemove = null;
      };
      e.preventDefault();
    },
  });
  app.mount(div);
  document.body.appendChild(div);
};

export default usePreView;

```

