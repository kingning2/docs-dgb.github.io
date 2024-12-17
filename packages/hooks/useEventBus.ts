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
