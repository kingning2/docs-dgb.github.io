<script setup name="Button" lang="jsx">
import { Icon } from '../Icon/index.vue'
import { ElButton } from 'element-plus'
defineProps({
  name: {
    type: String,
    default: '按钮',
  },
})
</script>

<template>
  <el-button
    :style="{
      backgroundColor: name === 'back' && '#58aefd',
      border: name === 'back' && 'none',
    }"
    v-bind="$attrs"
  >
    <div class="btn"><Icon :name="name" v-if="name"></Icon> <slot></slot></div>
  </el-button>
</template>

<style scoped lang="scss">
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
</style>
