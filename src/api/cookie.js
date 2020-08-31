
export default class Cookie {

    cookies = {};
    constructor() {
        this.initCookie();
        let _this = this;
        this.cookies = new Proxy(this.cookies, {
            set(target, key, val) {
                target[key] = val;
                _this.saveCookie(key, val);
                return true;
            },
            get(target, key) {
                return target[key];
            }
        })
    }

    initCookie() {
        let cookieStr = document.cookie;
        if (cookieStr !== "") {
            let cookies = cookieStr.split("; ");
            let cookiesLen = cookies.length;
            for (let i = 0; i < cookiesLen; i++) {
                let toArr = cookies[i].split('=');
                this.cookies[toArr[0]] = toArr[1];
            }
        }
    }
    
    saveCookie(key, val) {
        document.cookie = `${key}=${val}`;
    }

    setCookie(k, v) {
        this.cookies[k] = v;
    }

    getCookie(k) {
        return this.cookies[k];
    }
}