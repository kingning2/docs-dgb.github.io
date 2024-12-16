---
outline: deep
---

# useContext 组件通信事件

`useContext` 是 Vue 的 Hooks，用于在组件之间进行通信。

::: warning
必须在父组件之间进行注册，才可以在子组件进行接收
只要保证key不同就可以注册多个`context`
只需要传递字符串，内部会给你转化为 `symbol` 的格式
:::

## 基础用法

```tsx
// 父组件
import { type Ref, ref } from 'vue'

interface ContextProps {
  value: Ref<string>
  setValue: (val: string) => void
}

const key = 'context'

const value = ref('123')
const setValue = (val:string) => {
  value.value = val
}
createContext<ContextProps>(key, {
  value,
  setValue
})

// 子组件
const { value, setValue } = useContext<ContextProps>(key)
console.log(value, setValue) // 123, Function
```

## 使用场景

- 父子组件通信
- 兄弟组件通信
- 跨组件通信

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| createContext | 传递事件 | `<T>(key: string, value: T) => void` | - |
| useContext | 接收事件 | `<T>(key: string) => T` | - |

## 具体实现代码
::: details 源代码
```ts
import { inject, provide } from 'vue';

class UserSettingsState {
  key!: Record<string, symbol>;
  constructor() {
    this.key = {};
  }
  setSymbol(name: string) {
    this.key[name] = Symbol(name);
  }
  getSymbol(name: string) {
    return this.key[name];
  }
}
const userSettingsState = new UserSettingsState();

export const createContext = <T>(name: string, obj: T) => {
  userSettingsState.setSymbol(name);
  provide(userSettingsState.getSymbol(name), obj);
};
export const useContext = <T>(name: string): T => {
  return inject<T>(userSettingsState.getSymbol(name))!;
};

```

