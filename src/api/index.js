
import axios from 'axios'
import cookie from './cookie'

let HttpClient = axios.create({})

export default class Server {

    fetchDocs_(addr) {
        return HttpClient({
            url: `http://${addr}/doc/v1`,
            method: 'get',
            headers: {
                'Content-Type': 'application/x-www-form-urlencode'
            }
        })
    }

    fetchDocs() {
        return HttpClient({
            url: '/doc/v1',
            method: 'get',
            headers: {
                'Content-Type': 'application/x-www-form-urlencode'
            }
        })
    }

    fetchUpdated(addr) {
        return HttpClient({
            url: `http://${addr}/doc/v2/updated`,
            method: 'get',
            headers: {
                'Content-Type': 'application/x-www-form-urlencode'
            },
            params: {
                identity: new cookie().getCookie('identity'),
            }
        })
    }

    fetchAddFiles(){
        return HttpClient({
            url: '/doc/v2/added',
            method: 'get',
            headers: {
                'Content-Type': 'application/x-www-form-urlencode'
            },
            params: {
                identity: new cookie().getCookie('identity'),
            }
        })
    }
}