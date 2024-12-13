---
outline: deep
---

# useEventBus 事件总线

`useEventBus` 是 Vue 的 Hooks，用于在组件之间进行通信。

## 注册事件

```tsx
const eventBus = useEventBus()

eventBus.on('eventName', (data, data2) => {
  console.log(data, data2) // data: 1, data2: 2
})
```

## 触发事件

```tsx
eventBus.emit('eventName', 'data', 'data2')
```

## 移除事件

```tsx
eventBus.off('eventName')
```

## 使用场景

- 父子组件通信
- 兄弟组件通信
- 跨组件通信

::: tip
`useEventBus` 是参考 `mitt` 实现的，`mitt` 是 `Vue` 的事件总线，`mitt` 的详细用法可以参考 [mitt](https://github.com/developit/mitt)。
:::

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| on | 注册事件 | `(eventName: string, callback: (...data: any[]) => void) => void` | - |
| emit | 触发事件 | `(eventName: string, ...data: any[]) => void` | - |
| off | 移除事件 | `(eventName: string) => void` | - |

## 具体实现代码
::: details 代码
```ts
class EventBus {
  private events: Map<string | symbol, ((...res: any[]) => void)[]> = new Map();

  on(event: string | symbol, callback: (...res: any[]) => void) {
    const callbackList = this.get(event);
    if (callbackList.length === 0) {
      this.events.set(event, [callback]);
      return;
    }
    callbackList.push(callback);
  }
  emit(event: string | symbol, ...res: any[]) {
    const callbackList = this.events.get(event);
    if (callbackList?.length === 0) return;
    callbackList?.forEach((cb) => {
      cb(...res);
    });
  }

  off(event: string | symbol, callback: (...res: any[]) => void) {
    const callbackList = this.events.get(event);
    if (callbackList?.length === 0) return;
    callbackList?.forEach((cb) => {
      cb(...res);
    });
  }
}
export default new EventBus();


```

