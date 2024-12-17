import { onMounted, onUnmounted, watch } from 'vue';

const useEffect = <T extends any[]>(
  callback: Function,
  dependencies: T,
  options?: {
    mount?: boolean;
    once?: boolean;
  },
) => {
  let u = null;
  if (!dependencies || dependencies.length === 0) {
    let init = false;
    onMounted(() => {
      init = true;
      u = callback();
      u && onUnmounted(u);
    });
    return;
  }
  let un: (() => void) | null = null;
  const stop = watch(
    dependencies,
    () => {
      const unmountfn = callback();
      if (!un && unmountfn) {
        un = unmountfn;
        onUnmounted(() => {
          un?.();
          stop();
        });
      }
    },
    {
      deep: true,
    },
  );
  options?.mount &&
    onMounted(() => {
      un = callback();
    });
};

export default useEffect;
