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
        // console.log(endpoint);
        const res = await axios({
            url: endpoint,
            method,
            data,
            params: (method === 'GET') ? data : null
        })
        // console.log(res);
        return res.data
    } catch (err) {
        // data can be a login/register body — redact secret fields before this
        // ever reaches the console, not just the password: a failed sign-in
        // used to print the plaintext password (and email) right there.
        const redact = (obj) => (obj && typeof obj === 'object')
            ? Object.fromEntries(Object.entries(obj).map(([key, value]) =>
                /pass(word)?/i.test(key) ? [key, '[redacted]'] : [key, value]
              ))
            : obj
        console.log(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data: `, redact(data))
        // err.config.data is the raw outgoing request body (axios keeps it as a
        // JSON string) — the same password leak, reached through the error
        // object instead of the local `data` above. console.dir(err) would
        // print it in full, so redact that copy before it goes to the console;
        // the rest of err (message/stack/response) is left as-is for debugging.
        let requestData = err?.config?.data
        if (typeof requestData === 'string') {
            try {
                requestData = redact(JSON.parse(requestData))
            } catch {
                // not JSON (e.g. FormData) — nothing to redact by key
            }
        }
        console.dir({ ...err, config: err?.config && { ...err.config, data: requestData } })
        if (err.response && err.response.status === 401) {
            sessionStorage.clear()
            // window.location.assign('/login')
        }
        throw err
    }
}