import { useEffect, useState } from 'react';
import * as A from "react-loader-spinner";
import api from '../../api';
import {
    Elements,
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement
} from '@stripe/react-stripe-js';
import { loadStripe, type CreatePaymentMethodData } from '@stripe/stripe-js';
import { ToastContainer, toast } from 'react-toastify';

// utils
import { getShoppingInCart } from '../../utils/getShoppingItems';

// css
import 'react-toastify/dist/ReactToastify.css';

// types
interface Params {
    stripePk: string;
    baseUrl: string;
}
interface PaymentMethods {
    credit_card: string;
    pix: string;
    debit_card: string;
}

import type { ShoppingCart } from '../../types/globalTypes';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const CheckoutForm = ({ baseUrl = '' }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [shoppingCart, setShoppingCart] = useState<ShoppingCart[]>([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phone, setPhone] = useState('')
    const [cpf, setCpf] = useState('')
    const [loading, setLoading] = useState(true)
    const [userId, setUserId] = useState<string | undefined>()
    const [payment_method, setPayment_method] = useState<keyof PaymentMethods>('credit_card')
    const [installments, setInstallments] = useState(3)
    const [qrCodeImage, setQrCodeImage] = useState();
    const [pixCode, setPixCode] = useState('')
    const [loadingQrCode, setLoadingQrCode] = useState(true)

    useEffect(() => {
        const userIdStorage = localStorage.getItem('user_id') as string
        if (userIdStorage) {
            setUserId(userIdStorage)
            getUserById(userIdStorage)
        }
    }, [])

    useEffect(() => {
        if (payment_method === 'pix') {
            const generatePix = async () => {
                const { data } = await api.post('/generatePixQrCode', {
                    amount: totalPrice
                })
                setQrCodeImage(data.pixImage)
                setPixCode(data.brCode)
            }
            generatePix()
        }
    }, [payment_method])

    useEffect(() => {
        const getShoppingCartProducts = async () => {
            try {
                const { data } = await getShoppingInCart()
                setShoppingCart(data.map((book: any) => ({ ...book, cover: { ...book.product?.cover }, id: book.id, })))
                setTotalPrice(data.reduce((acc: any, value: any) => acc + value.price, 0))
                setLoading(false)
            } catch (err) {
                console.log(err)
            }
        }
        getShoppingCartProducts()
    }, [])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(pixCode)
        .then(() => toast.success('Copiado para a área de transferência!'))
    }

    const getUserById = async (userId: string) => {
        try {
            const { data } = await api.get(`/customers/${userId}`)
            if (data) {
                setCpf(cpfMask(data.cpf))
                setPhone(phoneMask(data.phone))
                setName(data.name)
                setEmail(data.email)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const sendPayment = async () => {
        if (!stripe || !elements) {
            console.log('stripe or elements is not set')
            return
        }
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardNumberElement),
            billing_details: {
                email,
                name,
                phone
            }
        } as CreatePaymentMethodData);

        if (error) {
            alert(error.message)
            console.error(error);
        } else {
            const { data } = await api.post('/create-payment-intent', {
                amount: totalPrice * 100,
                card_type: payment_method,
                installments,
                payment_method_id: paymentMethod.id
            });

            const { client_secret } = data

            const { error: confirmError } = await stripe.confirmCardPayment(client_secret);

            if (confirmError) {
                console.error(confirmError);
            } else {
                const newCustomer = await registerCustomer()
                await createSale(newCustomer.id)
                await clearCart()
            }
        }
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        toast.promise(
            sendPayment,
            {
                pending: 'Finalizando compra...',
                success: {
                    render: () => {
                        setTimeout(() => window.location.href = `${window.location.origin}/estante`, 600)
                        return 'Compra realizada com sucesso!'
                    }
                },
                error: 'Ocorreu um problema ao realizar a compra.'
            }
        )
    };

    const clearCart = async () => {
        try {
            await api.delete('/clear-cart')
            localStorage.removeItem('shoppingCartSize')
        } catch (err) {
            throw err
        }
    }

    const registerCustomer = async () => {
        try {
            const { data } = await api.post('/customers', {
                data: {
                    name,
                    cpf: removeCpfMask(cpf),
                    phone: removePhoneMask(phone),
                    email,
                    age: null,
                    birthdayDate: null,
                    childrenNumber: null,
                    hasChildren: null,
                    address: null,
                    postalCode: null,
                    number: null
                }
            })
            if (data) setUserId(data.id)

            return data;
        } catch (err) {
            console.log(err)
        }
    }

    const removePhoneMask = (phone: string) => phone.replace(/[()\- ]/g, '');

    const removeCpfMask = (cpf: string) => cpf.replace(/[.\-]/g, '');

    const createSale = async (userId: string) => {
        try {
            if (!shoppingCart || shoppingCart.length === 0) return;
            for (let buy of shoppingCart) {
                await api.post('/sales', {
                    data: {
                        price: buy.price,
                        userId,
                        couponCodes: "",
                        status: "Em progresso",
                        productId: `${buy.productId}`
                    }
                })
            }
        } catch (err) {
            throw err
        }
    }

    const phoneMask = (phone: string) => {
        return phone.replace(/\D/g, '')
            .replace(/^(\d)/, '($1')
            .replace(/^(\(\d{2})(\d)/, '$1) $2')
            .replace(/(\d{5})(\d{1,4})/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    }

    const cpfMask = (cpf: string) => {
        // Remove caracteres não numéricos
        cpf = cpf.replace(/\D/g, '');

        // Aplica a máscara
        if (cpf.length <= 3) return cpf;
        if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
        if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
        return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
    };

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
        <>
            {loading && (<SkeletonTheme
                borderRadius="0.5rem"
                duration={4}
            >
                <div className='h-full mt-3 md2:mt-6 2xl:mt-12 items-stretch flex flex-col'>
                    <Skeleton className={`w-[20px] h-[40px]`} />
                    <Skeleton className='h-[300px] box-border p-3 mt-[3rem] 2xl:mt-6' width={'100%'} />
                    <Skeleton className='h-[300px] box-border p-3 my-3 2xl:mt-6' width={'100%'} />
                </div>
            </SkeletonTheme>)}
            <form onSubmit={handleSubmit} className={`${loading ? 'h-0 opacity-0 z-[-1] absolute' : 'relative z-1 h-full transition-opacity duration-500 opacity-100 w-full flex-1'}`}>
                <div className="mt-3 md2:mt-6 2xl:mt-12 flex-col md2:flex-row flex justify-center items-center w-full">
                    <div className='flex-1 w-full'>
                        <div>
                            <div className='font-semibold text-[16px] sm:text-[20px] md:text-[24px] 2xl:text-[30px]'>Dados Pessoais</div>
                            <div className='mt-3 md:mt-6'>
                                <div className='p-3 md:p-6 border-2 border-[#969696] hover:border-[#4b4b4b] bg-transparent gap-3 flex flex-col transition-all rounded-2xl'>
                                    <div className='w-full'>
                                        <label className='text-[#969696] px-2' htmlFor="email-value-form">Email</label>
                                        <input required id='email-value-form' value={email} onChange={event => setEmail(event.target.value)} type="email" placeholder='Digite aqui' className='rounded-full p-2 w-full placeholder:text-[#969696] outline-none border border-[#969696] text-[#000000]' />
                                    </div>
                                    <div className='flex flex-col sm3:flex-row items-center gap-3'>
                                        <div className='w-full'>
                                            <label className='text-[#969696] px-2' htmlFor="name-value-form">Nome</label>
                                            <input required id='name-value-form' type="text" value={name} onChange={event => setName(event.target.value)} placeholder='Digite aqui' className='rounded-full p-2 w-full placeholder:text-[#969696] outline-none border border-[#969696] text-[#000000]' />
                                        </div>
                                        <div className='w-full'>
                                            <label className='text-[#969696] px-2' htmlFor="lastname-value-form">Sobrenome</label>
                                            <input id='lastname-value-form' type="text" value={lastName} onChange={event => setLastName(event.target.value)} placeholder='Digite aqui' className='rounded-full p-2 w-full placeholder:text-[#969696] outline-none border border-[#969696] text-[#000000]' />
                                        </div>
                                    </div>
                                    <div className='flex flex-col sm3:flex-row items-center gap-3'>
                                        <div className='w-full'>
                                            <label className='text-[#969696] px-2' htmlFor="name-value-form">CPF</label>
                                            <input required id='name-value-form' type="text" value={cpf} onChange={event => setCpf(cpfMask(event.target.value))} placeholder='Digite aqui' className='rounded-full p-2 w-full placeholder:text-[#969696] outline-none border border-[#969696] text-[#000000]' />
                                        </div>
                                        <div className='w-full'>
                                            <label className='text-[#969696] px-2' htmlFor="lastname-value-form">Telefone</label>
                                            <input id='lastname-value-form' type="tel" required value={phone} onChange={event => setPhone(phoneMask(event.target.value))} placeholder='Digite aqui' className='rounded-full p-2 w-full placeholder:text-[#969696] outline-none border border-[#969696] text-[#000000]' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col mt-3 md:mt-6 2xl:mt-12'>
                            <div className='font-semibold text-[16px] sm:text-[20px] md:text-[24px] 2xl:text-[30px]'>Pagamento</div>
                            <div className='mt-3 md:mt-6 flex flex-col sm:flex-row items-center border-2 border-[#DDCC13] rounded-2xl p-3 md:p-6'>
                                <div className='flex-1 flex-col text-[14px] md:text-[18px] 2xl:text-[26px] w-full'>
                                    <div onClick={() => setPayment_method('pix')} className={`${payment_method === 'pix' ? 'bg-[#DDCC13] !text-white' : 'text-[#DDCC13]'} w-full text-center border-[#DDCC13] rounded-full border-2 py-2 px-6 uppercase font-semibold mt-3 cursor-pointer hover:opacity-75`}>
                                        pix
                                    </div>
                                    <div onClick={() => setPayment_method('credit_card')} className={`${payment_method === 'credit_card' ? 'bg-[#DDCC13] !text-white' : 'text-[#DDCC13]'} w-full text-center border-[#DDCC13] rounded-full border-2 py-2 px-6 uppercase font-semibold mt-3 cursor-pointer hover:opacity-75`}>
                                        cartão de crédito
                                    </div>
                                    <div onClick={() => setPayment_method('debit_card')} className={`${payment_method === 'debit_card' ? 'bg-[#DDCC13] !text-white' : 'text-[#DDCC13]'} w-full text-center border-[#DDCC13] border-2 rounded-full py-2 px-6 uppercase font-semibold mt-3 cursor-pointer hover:opacity-75`}>
                                        cartão de débito
                                    </div>
                                </div>
                                {payment_method !== 'pix' && (<div className='flex-1 ml-0 mt-3 sm:mt-0 sm:ml-3 md:ml-6 bg-[#E7EAC0] rounded-2xl border-2 border-[#CFDA29] p-3 w-full'>
                                    <div className='w-full p'>
                                        <label className='px-2' htmlFor="">Número do cartão</label>
                                        <CardNumberElement className='rounded-full bg-white p-2 w-full placeholder:text-[#969696] outline-none border border-[#969696] text-[#000000]' />
                                    </div>
                                    <div className='flex flex-col sm3:flex-row items-center mt-3'>
                                        <div className='w-full'>
                                            <label className='px-2' htmlFor="">Validade</label>
                                            <CardExpiryElement className='rounded-full bg-white p-2 w-full placeholder:text-[#969696] outline-none border border-[#969696] text-[#000000]' />
                                        </div>
                                        <div className='w-full ml-0 mt-3 sm3:mt-0 sm3:ml-3'>
                                            <label className='px-2' htmlFor="">Código de segurança</label>
                                            <CardCvcElement className='rounded-full bg-white p-2 w-full placeholder:text-[#969696] outline-none border border-[#969696] text-[#000000]' />
                                        </div>
                                    </div>
                                </div>)}
                                {payment_method === 'pix' && (<div className='flex-1 ml-0 mt-3 sm:mt-0 items-center sm:ml-3 md:ml-6 bg-[#E7EAC0] rounded-2xl border-2 border-[#CFDA29] p-3 w-full'>
                                    {loadingQrCode && (<div className='flex flex-1 items-center justify-center'>
                                        <div>Gerando QrCode...</div>
                                        <A.ColorRing
                                            visible={true}
                                            ariaLabel="color-ring-loading"
                                            wrapperStyle={{}}
                                            wrapperClass="w-[30px] h-[30px]"
                                            colors={['#F6F6F6', '#F6F6F6', '#F6F6F6', '#F6F6F6', '#F6F6F6']}
                                        />
                                    </div>)}
                                    <div className='flex-1 flex items-center justify-center'>
                                        <img onLoad={() => setLoadingQrCode(false)} className='object-contain rounded-lg' src={qrCodeImage} alt="" />
                                    </div>
                                    {!loadingQrCode && (<div onClick={copyToClipboard} className='flex-1 mt-3 flex cursor-pointer items-center justify-center'>
                                        <div className='bg-white border-[#DDCC13] text-[14px] md:text-[16px] hover:border-[#fff] transition-all border text-[#DDCC13] py-3 px-6 rounded-full'>Copiar código</div>
                                    </div>)}
                                </div>)}
                            </div>
                        </div>
                    </div>
                    <div className='flex-1 ml-0 mt-3 sm:mt-6 md2:mt-0 md2:ml-6 2xl:ml-12 border-2 rounded-2xl border-[#969696] w-full'>
                        {shoppingCart.length !== 0 && (<div id='shoppin-cart-payment' className='p-3 m-3 h-auto max-h-[400px] overflow-y-auto overflow-x-hidden'>
                            {shoppingCart.slice(0, 10).map((item, index) => <div key={index} className="rounded-2xl flex justify-between items-center gap-2 md:gap-3">
                                <div className='py-2'>
                                    {/* <CoverBookImg
                                        className="h-fit w-inherit max-w-[60px] sm:w-[110px] md:w-[110px] lg:w-[110px] sm:max-w-none 2xl:max-w-none 2xl:h-[150px] 2xl:w-[110px]" /> */}
                                    <img src={`${baseUrl}${item?.cover.url}`} alt="" className='object-containh-fit w-inherit max-w-[60px] sm:w-[110px] md:w-[110px] lg:w-[110px] sm:max-w-none 2xl:max-w-none 2xl:h-[150px] 2xl:w-[110px]' />

                                </div>
                                <div className="flex-1 flex flex-col sm:flex-row justify-evenly">
                                    <div className="flex-1 flex flex-col items-start text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] 2xl:text-[20px]">
                                        <div className="font-semibold">{item.bookTitle}</div>
                                        <div className="text-[#D76B2A]">{item.bookAuthor}</div>
                                    </div>
                                    <div className="flex-1 flex items-center justify-end sm:justify-center">
                                        <div className="flex flex-col items-center">
                                            {<div className="text-[14px] sm:text-[16px] md:text-[18px] 2xl:text-[24px] font-medium">{formatPrice(item.price)}</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            )}
                        </div>)}
                        <div className={`flex-1 flex flex-col gap-3 text-[14px] md:text-[16px] 2xl:text-[20px] ${shoppingCart.length !== 0 ? 'border-t-2' : 'border-none'}  border-[#969696] p-6 rounded-t-2xl`}>
                            {shoppingCart.length !== 0 ? (
                                <a href='/carrinho/sacola' className='text-center underline text-[#EE8A21] text-[12px] md:text-[14px] 2xl:text-[16px]'>Voltar ao carrinho</a>)
                                : <div className="font-semibold text-center h-full text-[14px] flex-1 flex justify-center items-center md:text-[16px] 2xl:text-[18px] pt-12">Seu carrinho está vazio.</div>}
                            <div className="border-b-[2px] flex flex-row justify-between items-center pb-3">
                                <div>Subtotal</div>
                                <div className="font-semibold">{formatPrice(totalPrice)}</div>
                            </div>
                            <div className="border-b-[2px] flex flex-row justify-between items-center pb-3">
                                <div>Descontos</div>
                                <div className="font-semibold">R$000,00</div>
                            </div>
                            <div className="flex flex-row justify-between items-center text-[#CFDA29] pb-3">
                                <div>Total</div>
                                <div className="font-semibold">{formatPrice(totalPrice)}</div>
                            </div>
                            <div className='w-full'>
                                <button type="submit" disabled={!stripe || shoppingCart.length === 0} className="bg-[#CFDA29] disabled:cursor-not-allowed disabled:bg-[#c3c3c3] disabled:opacity-70 text-black hover:opacity-70 font-medium rounded-full py-2 px-10 w-full text-center">Finalizar Compra</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export const Checkout = ({ stripePk, baseUrl }: Params) => (
    <Elements stripe={loadStripe(stripePk)}>
        <CheckoutForm baseUrl={baseUrl} />
        <ToastContainer />
    </Elements>
);