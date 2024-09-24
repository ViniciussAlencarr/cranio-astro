import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://localhost:1337/api'
    baseURL: 'http://ec2-18-118-102-139.us-east-2.compute.amazonaws.com:1337/api'
});

export default api;