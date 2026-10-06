import Axios from 'axios'
import { QueryClient } from "react-query";

export const queryClient = new QueryClient();

// withCredentials sends the httpOnly auth cookie automatically, so the JWT is no
// longer read from localStorage (an XSS can't lift it out of an httpOnly cookie).
var axios = Axios.create({
    withCredentials: true
})

// Reads a non-httpOnly cookie by name (used for the CSRF token the backend sets).
function readCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
    return match ? decodeURIComponent(match[1]) : null
}

// Double-submit CSRF: echo the readable csrfToken cookie back in a header on every
// state-changing request. The backend rejects the request if the two don't match.
const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])
axios.interceptors.request.use((config) => {
    if (MUTATING.has((config.method || '').toUpperCase())) {
        const csrf = readCookie('csrfToken')
        if (csrf) {
            config.headers = config.headers || {}
            config.headers['X-CSRF-Token'] = csrf
        }
    }
    return config
})

export const httpService = {
    get(endpoint, data) {
        return ajax(endpoint, 'GET', data)
    },
    post(endpoint, data) {
        return ajax(endpoint, 'POST', data)
    },
    put(endpoint, data) {
        return ajax(endpoint, 'PUT', data)
    },
    delete(endpoint, data) {
        return ajax(endpoint, 'DELETE', data)
    }
}

async function ajax(endpoint, method = 'GET', data = null) {
    try {
        const res = await axios({
            url: endpoint,
            method,
            data,
            params: (method === 'GET') ? data : null
        })
        return res.data
    } catch (err) {
        // Nothing is logged here, on purpose. `data` can be a login/register
        // body and `err.config.data` is the same body as axios serialised it; a
        // failed sign-in used to print the plaintext password through both. A
        // redaction step was tried and is a weaker guarantee than not writing
        // request data to the console at all. Every caller (react-query
        // mutations, App's /me probe) receives the rethrown error and decides
        // what the user sees, so nothing is lost by staying silent here.
        if (err.response && err.response.status === 401) {
            sessionStorage.clear()
            // window.location.assign('/login')
        }
        throw err
    }
}