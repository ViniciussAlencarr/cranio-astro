import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:1337/api'
    // baseURL: 'https://capable-cuddle-84d83ce599.strapiapp.com/api'
});

export default api;