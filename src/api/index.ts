import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://localhost:1337/api',
    baseURL: 'https://api.cranio.converter.tec.br/api'
    // headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ` + localStorage.getItem("jwt")
    // }
});

export default api;