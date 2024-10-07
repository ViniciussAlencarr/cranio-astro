import api from "../api"

// utils
import { validateTokenJwt } from "./validateJwt"

export const getShoppingInCart = async () => {
    try {
        const tokenExpired = validateTokenJwt()
        const userId = localStorage.getItem('user_id') as string
        return !tokenExpired && userId ? await api.get(`/products-in-cart-by-customer/${userId}?populate=*`) : await api.get('/products-in-cart?populate=*')
    } catch (err) {
        console.log(err)
        throw err
    }
}