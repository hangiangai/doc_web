import Vue from 'vue'
import VueRoute from 'vue-router'
import Routes from './route'

Vue.use(VueRoute)

export default new VueRoute({
    mode: 'history',
    routes: Routes,
})