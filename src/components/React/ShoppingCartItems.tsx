import { useEffect, useState } from "react";
import api from "../../api";

// icons
import { IoTrashOutline } from "react-icons/io5"

//utils
import { CoverBookImg } from "../../utils/getSvgIcons"

// style
import './index.css'

// types
import type { ShoppingCart } from "../../types/globalTypes";

export const ShoppingCartItems = () => {
    const [shoppingCart, setShoppingCart] = useState<ShoppingCart[]>([])
    const [total, setTotal] = useState(0.0)

    useEffect(() => {
        const getShoppingCartProducts = async () => {
            try {
                const { data } = await api.get('/products-in-cart')
                setShoppingCart(data)
            } catch (err) {
                console.log(err)
            }
        }
        getShoppingCartProducts()
    }, [])

    useEffect(() => setTotal(shoppingCart.reduce((acc, value) => acc + value.price, 0)), [shoppingCart])

    const removeItem = (removedItem: ShoppingCart) => {
        removeFromCart(removedItem.id)
            .then(() => {
                setShoppingCart(shoppingCart.filter(item => item.id !== removedItem.id))
            })
            .catch(err => console.log(err))
    }

    function getRandomFloat(min: number, max: number) {
        const randomNumber = Math.random() * (max - min) + min;

        // Arredonda para duas casas decimais
        return Math.round(randomNumber * 100) / 100;
    };

    const removeFromCart = async (productId: string) => {
        try {
            await api.delete(`/product-in-cart/${productId}`)
        } catch (err) {
            throw err
        }
    }

    const formatPrice = (valor: number) => {
        try {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2, // Número mínimo de casas decimais
                maximumFractionDigits: 2, // Número máximo de casas decimais
            }).format(valor);
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="flex flex-col">
            <div className="flex-1 overflow-auto h-auto max-h-[470px] scrollbar-hidden">
                <div className="flex-col flex h-full gap-3">
                    {shoppingCart.length !== 0 ? shoppingCart.slice(0, 10).map((item, index) => <div key={index} className="border rounded-2xl p-2 md:p-4 2xl:p-6 border-[#636363] flex justify-between items-center gap-2 md:gap-3">
                        <div>
                            <CoverBookImg
                                className="h-fit w-inherit max-w-[50px] sm:w-[110px] md:w-[110px] lg:w-[110px] sm:max-w-none 2xl:max-w-none 2xl:h-[150px] 2xl:w-[110px]" /></div>
                        <div className="flex-1 flex flex-col sm:flex-row justify-evenly">
                            <div className="flex-1 flex flex-col items-start text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] 2xl:text-[20px]">
                                <div className="font-semibold">{item.bookTitle}</div>
                                <div className="text-[#D76B2A]">{item.bookAuthor}</div>
                            </div>
                            <div className="flex-1 flex items-center justify-end sm:justify-center">
                                <div className="flex flex-col items-center">
                                    {<div className="line-through text-[#636363] text-[12px] md:text-[14px] 2xl:text-[16px]">{formatPrice(item.price - (item.price * 0.10))}</div>}
                                    {<div className="text-[#CFDA29] text-[14px] sm:text-[16px] md:text-[18px] 2xl:text-[24px] font-medium">{formatPrice(item.price)}</div>}
                                </div>
                            </div>
                        </div>
                        <div className="cursor-pointer" onClick={() => removeItem(item)}><IoTrashOutline color="D76B2A" className="h-[16px] w-[16px] md:h-[18px] md:w-[18px] 2xl:h-[25px] 2xl:w-[25px]" size={25} /></div>
                    </div>
                    ) : <div className="font-semibold text-center h-full text-[14px] flex-1 flex justify-center items-center md:text-[16px] 2xl:text-[18px] pt-12">Seu carrinho está vazio.</div>}
                </div>
            </div>
            <div className="pt-3 md:pt-6 2xl:pt-12 flex items-center justify-end flex-1">
                <div className="flex-none md:flex-1"></div>
                <div className="flex-1 flex flex-col gap-3 text-[14px] md:text-[16px] 2xl:text-[20px]">

                    <div className="border-b-[2px] flex flex-row justify-between items-center pb-3">
                        <div>Subtotal</div>
                        <div className="font-semibold">{formatPrice(total)}</div>
                    </div>
                    <div className="border-b-[2px] flex flex-row justify-between items-center pb-3">
                        <div>Descontos</div>
                        <div className="font-semibold">R$000,00</div>
                    </div>
                    <div className="flex flex-row justify-between items-center text-[#CFDA29] pb-3">
                        <div>Total</div>
                        <div className="font-semibold">{formatPrice(total)}</div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-evenly">
                        <div>
                            <button onClick={() => window.location.href = `${window.location.origin}/livros`} className="bg-[#EE8A21] text-white font-medium hover:opacity-70 rounded-full py-2 px-6">Continuar comprando</button>
                        </div>
                        <div>
                            <button onClick={() => window.location.href = `${window.location.origin}/carrinho/identificacao`} className="bg-[#CFDA29] text-black hover:opacity-70 font-medium rounded-full py-2 px-10">Finalizar compra</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}