import axios from '../../axios'
import { AxiosRequestConfig } from 'axios'
// axios.ts has the base url
import { StoreWithDetails, CreateStoreRequest } from './storeTypes'

const path = "/api/stores/"

export const storeAPI = {
    stores(url = path) {
        return {
            fetchAllUserStores: (config: AxiosRequestConfig) => axios.get<StoreWithDetails[]>(url + 'userstores', config),
            createStore: (requestObject: CreateStoreRequest, config: AxiosRequestConfig) => axios.post<StoreWithDetails>(url + 'createstore', requestObject, config)
        }
    }
}