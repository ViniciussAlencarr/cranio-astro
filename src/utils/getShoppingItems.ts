import api from "../api"

export const getShoppingInCart = async () => {
    try {
        const userId = localStorage.getItem('user_id') as string
        return await api.get(`/products-in-cart-by-customer/${userId}?populate=*`)
    } catch (err) {
        console.log(err)
        throw err
    }
}