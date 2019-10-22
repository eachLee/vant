import Vue from 'vue'
import App from './App.vue'
import '@/styles/index.css'
import { Button } from 'vant'
import { List } from 'vant'
import { Tabbar, TabbarItem } from 'vant'
import { DatetimePicker } from 'vant'
import { Field } from 'vant'
import { DropdownMenu, DropdownItem } from 'vant'
import { Cell, CellGroup } from 'vant'
import { Search } from 'vant'
import { Popup } from 'vant'
import { Table, TableColumn } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { Pagination } from 'vant'

Vue.use(Pagination)
Vue.use(Table).use(TableColumn)

Vue.use(Popup)
Vue.use(Search)

Vue.use(Cell).use(CellGroup)

Vue.use(DropdownMenu).use(DropdownItem)
Vue.use(Field)
Vue.use(DatetimePicker)

Vue.use(Tabbar).use(TabbarItem)
Vue.use(Button, List)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
