import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://localhost:44371/'
})

export default instance;