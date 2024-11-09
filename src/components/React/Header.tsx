import { useCallback, useEffect, useState } from "react";

// icons
import { IoIosSearch } from "react-icons/io";
import { IoReorderThreeOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";

// utils
import {
    LogoIcon,
    ShoppingCartIcon,
    UserIcon
} from "../../utils/getSvgIcons";
import { validateTokenJwt } from "../../utils/validateJwt";
import { getShoppingInCart } from "../../utils/getShoppingItems";
import { LuUserSquare2 } from "react-icons/lu";
import { CiLogout } from "react-icons/ci";

export const Header = () => {
    const [statusLoggedText, setStatusLoggedText] = useState<string | undefined>(undefined)
    const [isLogged, setIsLogged] = useState(false)
    const [userName, setUserName] = useState('')
    const [openOpts, setOpenOpts] = useState(false);

    const [shoppingCartSize, setShoppingCartSize] = useState<string | null>(null)

    useEffect(() => {
        const username = localStorage.getItem('user_name')
        setUserName(username as string || 'Seu nome')
    }, [])

    useEffect(() => {
        document.addEventListener('UpdateShoppingCartSize', updateShoppingCartSize)
    }, [])

    useEffect(() => {
        const getShoppingCartProducts = async () => {
            try {
                const { data } = await getShoppingInCart()
                const cartSize = JSON.stringify(data.length)

                aux(data)

                setShoppingCartSize(cartSize)
                localStorage.setItem('shoppingCartSize', cartSize)
            } catch (err) {
                console.log(err)
            }
        }
        getShoppingCartProducts()
    }, [])

    useEffect(() => {
        const tokenExpired = validateTokenJwt()
        setIsLogged(!tokenExpired)
        setStatusLoggedText(!tokenExpired ? 'Área do cliente' : '')
    }, [])

    const aux = useCallback((shoppingCartData: any) => {
        const event = new CustomEvent('ShoppingCartData', {
            detail: shoppingCartData
        })
        document.dispatchEvent(event)
    }, [shoppingCartSize])

    const updateShoppingCartSize = () => {
        const currentSize = localStorage.getItem('shoppingCartSize') || '0'
        setShoppingCartSize(currentSize)
    }

    const links = [
        { key: 'home', text: 'Home', path: '/' },
        { key: 'howWorks', text: 'Como funciona?', path: '' },
        { key: 'about', text: 'Crânio', path: '' },
        { key: 'books', text: 'Livros', path: '/livros' },
        { key: 'testimonials', text: 'Depoimentos', path: '' },
        { key: 'contact', text: 'Contato', path: '' }
    ]

    const logOut = () => {
        localStorage.clear()
        window.location.href = window.location.origin
    }

    const goToAccount = () => {
        const tokenExpired = validateTokenJwt()
        window.location.href = tokenExpired ? `${window.location.origin}/login` : `${window.location.origin}/estante`
    }

    const goToBooks = () => {
        window.location.href = `${window.location.origin}/livros`
    }

    return (
        <div className='bg-[#CFDA29] relative py-3 px-5 sm:px-7 md:px-14 xl:px-14'>
            <div className="flex flex-col xl3:flex-row items-center w-full">
                <div className="flex items-center justify-between lg:justify-evenly xl:justify-between w-full transition-all duration-500">
                    {openOpts && (<div className="w-[38px] h-[38px] sm:w-[45px] sm:h-[45px] md:w-[50px] md:h-[50px]"></div>)}
                    <div onClick={() => setOpenOpts(!openOpts)} className={`block cursor-pointer z-20 lg:hidden xl:hidden ${openOpts && 'fixed'}`}>
                        <>
                            {openOpts ? (<IoMdClose className="w-[38px] h-[38px] sm:w-[45px] sm:h-[45px] md:w-[50px] md:h-[50px]" />) : (<IoReorderThreeOutline className="w-[38px] h-[38px] sm:w-[45px] sm:h-[45px] md:w-[50px] md:h-[50px]" />)}
                        </>
                    </div>
                    <a href="/"><LogoIcon className="w-[150px] sm:w-[160px] md:w-[180px] xl:w-[200px]" /></a>
                    <div className="hidden lg:flex xl:flex items-center justify-evenly ">
                        {links.map((link, index) => <a className="text-[#fff] truncate lg:mx-2 xl:mx-4 md:text-[16px] text-center lg:text-[18px] xl:text-[20px] font-semibold cursor-pointer hover:underline transition-all" key={index} href={link.path}>{link.text}</a>)}
                    </div>
                    <div className="items-center justify-center px-4 py-3 w-auto xl3:w-[350px] rounded-full bg-white hidden xl3:flex">
                        <div><IoIosSearch color="#CFDA29" size={25} /></div>
                        <input type="text" className="border-none w-full placeholder:text-black text-center bg-none bg-transparent outline-none" placeholder="O que você busca?" />
                    </div>
                    <div className="relative">
                        {shoppingCartSize && (<div className="p-2 flex justify-center items-center font-semibold w-[20px] h-[20px] border-white text-center  text-[14px] border rounded-full bg-[#fff] absolute top-0 right-0 z-20">{shoppingCartSize}</div>)}
                        <a href={isLogged ? "/carrinho/sacola" : '/login'} className="cursor-pointer hover:opacity-70"><ShoppingCartIcon size={"57"} className="w-[45px] sm:w-[48px] md:w-[57px] xl:w-[57px]" /></a>
                    </div>
                    <div className="min-w-[146px] flex justify-center items-center absolute text-center h-0 opacity-0 lg:relative lg:h-auto lg:opacity-100 transition-opacity duration-500">
                        {statusLoggedText === undefined ? (
                            <svg className="animate-spin -ml-1 mr-3 h-7 w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>)
                            : isLogged ? (<a href="/estante" className="cursor-pointer hover:opacity-70 font-semibold text-[14px] md:text-[16px] 2xl:text-[20px]">
                                Área do cliente
                            </a>) : (<a href="/login" className="cursor-pointer hover:opacity-70"><UserIcon size={"61"} className="md:w-[50px] lg:w-[58px] xl:w-[61px]" /></a>)}
                    </div>
                </div>
                <div className="items-center justify-center p-2 sm:px-3 sm:py-2 md:px-4 md:py-3 lg:px-4 lg:py-3 w-full sm:w-[350px] lg:w-[350px] mt-3 rounded-full bg-white flex xl3:hidden">
                    <div><IoIosSearch color="#CFDA29" size={25} /></div>
                    <input type="text" className="border-none w-full placeholder:text-black text-center text-[14px] md:text-[16px] lg:text-[16px] bg-none bg-transparent outline-none" placeholder="O que você busca?" />
                </div>
            </div>
            <div className={`${openOpts ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 lg:hidden xl:hidden fixed z-10 left-0 w-[calc(100%-5rem)] bg-white p-3 top-0 h-svh border shadow-xl shadow-gray-700 rounded-br-2xl`}>
                <div className="pt-[10vh] py-3 px-5 sm:px-7 md:px-14 xl:px-14 top-[10vh] h-full w-full left-0 flex flex-col">
                    <div onClick={goToAccount} className="flex flex-row items-center cursor-pointer">
                        <div><LuUserSquare2 className="w-[50px] h-[50px] md:w-[65px] md:h-[65px] 2xl:w-[75px] 2xl:h-[75px]" /></div>
                        <div id="username" className="ml-3 2xl:ml-6 font-medium text-[20px]">{userName}</div>
                    </div>
                    <div onClick={goToBooks} className="mt-6 cursor-pointer">
                        <span className="text-[20px] font-semibold text-[#CFDA29] hover:underline cursor-pointer">Livros</span>
                    </div>
                    <div className="content-end flex-1">
                        <div onClick={logOut} id="logOutBtn" className="flex flex-row items-center cursor-pointer hover:opacity-70">
                            <div><CiLogout color="#F7262E" className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] 2xl:w-[50px] 2xl:h-[50px]" /></div>
                            <div className="font-semibold ml-3 2xl:ml-6 text-[20px]">Sair</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}