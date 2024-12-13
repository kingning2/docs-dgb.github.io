<script setup name="icon" lang="jsx">
defineProps({
  name: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <i class="iconfont icon-warpper" :class="`icon-${name}`" v-bind="$attrs"></i>
</template>

<style scoped lang="scss">
.icon-warpper {
  font-size: 16px;
}
</style>
