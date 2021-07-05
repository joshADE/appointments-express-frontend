import axios from '../../axios'
import { AxiosRequestConfig } from 'axios'
// axios.ts has the base url
import { StoreWithDetails, CreateStoreRequest, StoreHours } from './storeTypes'
import { JsonPatchDocument } from '../commonTypes'

const path = "/api/stores/"

export const storeAPI = {
    stores(url = path) {
        return {
            fetchAllUserStores: (config: AxiosRequestConfig) => axios.get<StoreWithDetails[]>(url + 'userstores', config),
            createStore: (requestObject: CreateStoreRequest, config: AxiosRequestConfig) => axios.post<StoreWithDetails>(url + 'createstore', requestObject, config),
            editStoreInfo: (id: number, jsonPatch: JsonPatchDocument[], config: AxiosRequestConfig) => axios.patch<StoreWithDetails>(url + id, jsonPatch, config),
            editStoreHours: (id: number, hours: Partial<StoreHours>[], config: AxiosRequestConfig) => axios.put<StoreWithDetails>(url + 'hours/' + id, hours, config),
        }
    }
}