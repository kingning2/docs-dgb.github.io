export interface ListTableProps {
    title?: string
    key?: string
    dataIndex?: string
    width?: number | string
    options?: Record<string, any>
    render?: (text: any, record: any) => any
    headerRender?: (text: any, record: any) => any
}

import { App } from 'vue'
import ListTable from './src/index.vue'

type SFCWithInstall<T> = T & { install(app: App): void }

ListTable.install = function(app: App) {
  app.component(ListTable.name as string, ListTable)
}

export default ListTable as SFCWithInstall<typeof ListTable> 