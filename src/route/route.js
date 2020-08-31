
import Main from './../views/Main'

export default [
    {
        path: '/doc/',
        component: Main,
    },
    {
        path: '/doc/test02',
        component: () => import('./../views/TestShow')
    }
]