import { ref, type Ref } from 'vue';
import { useDebounce, useThrottle } from '.';

interface RequestOptions<T, D> {
  manaul?: boolean; // 是否手动触发
  defaultParams?: D; // 默认参数
  debounceWait?: number; // 防抖时间
  cacheTime?: number; // 缓存时间
  cache?: boolean; // 是否缓存
  once?: boolean; // 是否执行一次
  retryCount?: number; // 重试次数
  retryDelay?: number; // 重试间隔
  isLoading?: boolean; // 是否显示loading
  throttleWait?: number; // 节流时间
  onBefore?: (params: D) => void; // 请求前
  onSuccess?: (data?: T, params?: D) => void; // 请求成功
  onError?: (error: Error, params?: D) => void; // 请求失败
  onFinally?: (
    cb?: (...rest: any[]) => void,
    params?: D,
    data?: T,
    error?: Error,
  ) => void; // 请求完成
}

interface RequestResult<T, P> {
  loading: Ref<boolean>; // 请求状态
  data?: Ref<T>;
  error?: Error;
  refresh: () => void; // 刷新

  run(params?: P, cb?: (...rest: any[]) => void): void; // 触发请求
}

/**
 * 封装请求
 * @param api 请求函数
 * @param options 配置项
 * @returns
 */
function useRequest<TData, TParams>(
  api: (res: TParams) => Promise<TData>,
  options: RequestOptions<TData, TParams> = {
    manaul: false,
    cache: true,
    cacheTime: 30000,
    defaultParams: {} as TParams,
    debounceWait: 0,
    throttleWait: 0,
    retryCount: 0,
    retryDelay: 3000,
    isLoading: true,
    once: false,
    onBefore: () => {},
    onSuccess: () => {},
    onError: () => {},
    onFinally: () => {},
  },
): RequestResult<TData, TParams> {
  const {
    onSuccess,
    onBefore,
    onError,
    onFinally,
    manaul,
    defaultParams = {} as TParams,
    debounceWait,
    cache,
    cacheTime,
    retryDelay,
    retryCount,
    throttleWait,
    once,
  } = options || {};
  let o = false;
  let retry = 0;
  let isSuccess = false;
  let timer: number | null = null;
  const data = ref<TData | null>(null);
  const loading = ref(false);
  const paramsList = ref<TParams>(defaultParams);
  const errValue = ref<Error>();
  let run = async (params: TParams, cb?: (...rest: any[]) => void) => {
    if (once && o) {
      return;
    }
    if (cache && data.value) {
      if (!timer) {
        timer = setTimeout(() => {
          data.value = null;
          clearTimeout(timer as number);
        }, cacheTime) as unknown as number;
      }
      return data.value;
    }
    paramsList.value = params || paramsList.value;
    onBefore?.(paramsList.value as TParams);
    loading.value = true;
    try {
      const res = await api(paramsList.value as TParams);
      isSuccess = true;
      // if
      data.value = res as TData;
      onSuccess?.(res);
      if (once) o = true;
    } catch (err) {
      errValue.value = err as Error;
      onError?.(err as Error, paramsList.value as TParams);
      if (!retryCount) return Promise.reject(err);
      setTimeout(() => {
        if (retry >= retryCount && !isSuccess) return;
        retry++;
        run(paramsList.value as TParams);
      }, retryDelay);
    } finally {
      loading.value = false;
      onFinally?.(cb, paramsList.value as TParams, data.value as TData, errValue.value);
    }
  };
  const refresh = () => {
    run(paramsList.value as TParams);
  };
  if (debounceWait) {
    run = useDebounce(run, debounceWait) as (
      params: TParams,
      cb?: (...rest: any[]) => void,
    ) => Promise<TData>;
  }
  if (throttleWait) {
    run = useThrottle(run, throttleWait) as (
      params: TParams,
      cb?: (...rest: any[]) => void,
    ) => Promise<TData>;
  }
  if (!manaul) {
    run(defaultParams);
  }

  return {
    run,
    refresh,
    loading,
    // @ts-ignore
    data,
    error: errValue.value,
  };
}

export default useRequest;
