import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:1337/api'
    // baseURL: 'https://cranio-app-0b301e2c4ce6.herokuapp.com'
});

export default api;