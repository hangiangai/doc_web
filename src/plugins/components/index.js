
let Custom = {}
import Selector from './an-input'
import Input from './an-selector'
import Button from './an-button'

Custom.install = function (Vue) {
    Vue.component(Selector.name, Selector);
    Vue.component(Input.name, Input);
    Vue.component(Button.name, Button);
}

export default Custom;