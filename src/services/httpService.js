import Axios from 'axios'
import { QueryClient } from "react-query";

export const queryClient = new QueryClient();

var axios = Axios.create({
    withCredentials: true
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