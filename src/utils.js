import Cookie from "@/api/cookie";
import config from "./../public/config.json"
import Server from "./api/index"
import {v4 as uuidv4} from "uuid";


class _Websocket {

    constructor(option) {
        if(this.isSupport()){
            this.protocol = this.protocolType();
            this.wsSocket = {};
            this.url = option.url;
            this.initWebsocket();
        }
    }

    protocolType() {
        return window.location.protocol === 'http' ? 'ws://' : 'wss://'
    }

    isSupport() {
        if (!window.WebSocket) {
            console.error('error ')
            return false
        }
        return true
    }

    on(name, event) {
        this.name = event;
    }

    initWebsocket() {
        let _this = this;
        this.wsSocket = new WebSocket(this.url);
        this.wsSocket.onopen = function (event) {
            _this.handleEvent('open', event);
        }
        this.wsSocket.onmessage = function (event) {
            _this.handleEvent('message', event);
        }
        this.wsSocket.onclose = function (event) {
            _this.handleEvent('close', event);
        }
        this.wsSocket.onerror = function (event) {
            _this.handleEvent('error', event);
        }
    }

    handleEvent(evName, event) {
        switch (evName) {
            case 'open':
                this.open(event);
                break;
            case 'message':
                this.message(event);
                break;
            case 'close':
                this.close(event);
                break;
            case 'error':
                this.error(event);
        }
    }

    reconnect() {

    }

}


export default class Utils {

    constructor() {
        this.cookie = new Cookie();
    }

    initNewWebSocket(addr) {
        return new WebSocket(`ws://${addr}/updated`);
    }

    initSites(sites) {
        let siteInfo = [];
        return func => {
            sites.forEach(site => {
                let ws = this.initNewWebSocket(site.addr);
                func && func(ws);
                siteInfo.push({
                    ws: ws,
                    addr: site.addr,
                    server: site.server
                })
            })
            return siteInfo
        }
    }

    initRunEnv(vue) {
        if (!this.cookie.getCookie("autoTest")) {
            this.cookie.setCookie("autoTest", "false");
        }
        if (!this.cookie.getCookie("defaultValues")) {
            this.cookie.setCookie("defaultValues", "");
        }
        if (!this.cookie.getCookie('identity')) {
            this.cookie.setCookie("identity", uuidv4());
        }
        vue.prototype.$cookie = this.cookie;
        vue.prototype.$server = new Server();
        vue.prototype.$sites = this.initSites(config.site)((ws) => {
            let _this = this;
            ws.onopen = function () {
                ws.send(JSON.stringify({
                    type: 1,
                    data: 'hello world !!!',
                    identity: _this.cookie.getCookie('identity'),
                    status: 0,
                }))
            }
        })
        return this;
    }
}