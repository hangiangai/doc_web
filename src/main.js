import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'element-ui/lib/theme-chalk/index.css';
import Routes from './route'
import UI from './plugins/components'
import Utils from './utils'

import {
    Popover,
    Input,
    Icon,
    Dialog,
    Drawer,
    Card,
    Table,
    TableColumn,
    Tag,
    Button,
    Switch
} from 'element-ui';

Vue.use(Drawer);
Vue.use(Dialog);
Vue.use(Icon);
Vue.use(Input);
Vue.use(Popover);
Vue.use(Card);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tag);
Vue.use(Button);
Vue.use(Switch);
Vue.use(UI);
Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

new Utils().initRunEnv(Vue);

new Vue({
    router: Routes,
    render: h => h(App),
}).$mount('#app')
