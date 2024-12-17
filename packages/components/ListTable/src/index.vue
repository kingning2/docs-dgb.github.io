<style lang="scss" scoped>
.table-container {
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 10px;
  width: 100%;
}

.right-toolbar-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
<script setup name="ListTable">
import { reactive, toRef, toRefs } from 'vue'
import { useContext, useEffect, useThrottle } from '../../../hooks'
import RightToolbar from './toolbar.vue'
import Pagination from './page.vue'
import { ElTable, ElTableColumn } from 'element-plus'
import { ref } from 'vue'
const props = defineProps({
  dataSource: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    default: () => [],
  },
  splitPage: {
    type: Boolean,
    default: false,
  },
  toolbar: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  width: {
    type: [String, Number],
  },
  height: {
    type: [String, Number],
  },
})

/**
 * 获取对象的长度
 */
const getLength = (obj) => {
  let count = 0
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      count++
    }
  }
  return count
}

const emit = defineEmits(['pagination', 'refresh', 'onSearch'])
const { dataSource, columns, splitPage, toolbar, loading } = toRefs(props)
const p = reactive({
  pageNum: 1,
  pageSize: 10,
})

// const context = useContext()

const lastItem = columns.value[columns.value.length - 1] || {}
if (lastItem.title === '操作') {
  lastItem.options = {
    ...lastItem.options,
    fixed: 'right',
  }
}

const tableHeight = ref()
const showSearch = ref(true)

const showColums = toRef(
  columns.value.map((item) => ({
    key: item.key,
    label: item.title,
    visible: true,
  }))
)
const resize = useThrottle(() => {
  const table = document.querySelector('.table-container')
  const el = document
    .querySelector('.el-table__inner-wrapper')
    .getBoundingClientRect()
  const h = el.height
  const bottom =
    window.innerHeight -
    table.getBoundingClientRect().y -
    table.getBoundingClientRect().height -
    40
  tableHeight.value = h + bottom
}, 100)

useEffect(() => {
  emit('onSearch', showSearch.value)
  resize()
}, [showSearch])

useEffect(() => {
  const page = document.querySelector('.table-container')
  const observer = new IntersectionObserver(
    (entries, observer) => {
      const e = entries[0]
      if (!e.isIntersecting) {
        resize()
        observer.disconnect()
        window.addEventListener('resize', resize)
      }
    },
    {
      root: null,
      rootMargin: '-20px',
      threshold: 1,
    }
  )
  
  observer.observe(page)

  return () => {
    observer.disconnect()
    window.removeEventListener('resize', resize)
  }
}, [])
</script>

<template>
  <div class="table-container">
    <div class="right-toolbar-container">
      <slot></slot>
      <RightToolbar
        v-if="toolbar"
        v-model:showSearch="showSearch"
        @QueryTable="
          () => {
            emit('refresh')
          }
        "
        search
        :columns="showColums"
      />
    </div>
    <div class="table">
      <ElTable
        v-loading="loading"
        :data="dataSource"
        style="width: 100%"
        :max-height="props.height || tableHeight"
        v-bind="$attrs"
      >
        <ElTableColumn
          v-for="item in columns"
          :prop="item.dataIndex"
          :width="item.width || props.width"
          :key="item.key"
          :label="item.title"
          :align="item.options?.align || 'center'"
          v-bind="item.options"
        >
          <template #default="scope" v-if="item.render">
            <component
              :is="() => item.render(scope.row[item.dataIndex], scope.row)"
            ></component>
          </template>
          <template #header v-if="item.headerRender">
            <component
              :is="() => item.headerRender(item.title, item)"
            ></component>
          </template>
        </ElTableColumn>
      </ElTable>
      <Pagination
        v-if="splitPage"
        :total="dataSource.length"
        v-model:page="p.pageNum"
        v-model:limit="p.pageSize"
        @pagination="
          (page) => {
            const { page: pageNum, limit: pageSize } = page
            emit('pagination', {
              pageNum,
              pageSize,
            })
          }
        "
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.table-container {
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 10px;
  width: 100%;
}
.right-toolbar-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
