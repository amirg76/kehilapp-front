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
        console.log(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data: `, data)
        console.dir(err)
        if (err.response && err.response.status === 401) {
            sessionStorage.clear()
            // window.location.assign('/login')
        }
        throw err
    }
}