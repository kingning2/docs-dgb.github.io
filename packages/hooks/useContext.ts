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
