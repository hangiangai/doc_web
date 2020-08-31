
export default {

    set(key, val){
        localStorage.setItem(key, val);
    },

    get(key){
        localStorage.getItem(key);
    }
}