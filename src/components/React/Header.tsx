import { useEffect, useState } from "react";

import { IoIosSearch } from "react-icons/io";
import { IoReorderThreeOutline } from "react-icons/io5";

import {
    LogoIcon,
    ShoppingCartIcon,
    UserIcon
} from "../../utils/getSvgIcons";

export const Header = () => {
    const [shoppingCartSize, setShoppingCartSize] = useState<string | null>(null)

    useEffect(() => {
        document.addEventListener('UpdateShoppingCartSize', updateShoppingCartSize)
        updateShoppingCartSize()
    }, [])

    const updateShoppingCartSize = () => {
        const currentSize = localStorage.getItem('shoppingCartSize') || '0'
        setShoppingCartSize(currentSize)
    }

    const [openOpts, setOpenOpts] = useState(false);

    const links = [
        { key: 'home', text: 'Home', path: '/' },
        { key: 'howWorks', text: 'Como funciona?', path: '' },
        { key: 'about', text: 'Crânio', path: '' },
        { key: 'books', text: 'Livros', path: '/livros' },
        { key: 'testimonials', text: 'Depoimentos', path: '' },
        { key: 'contact', text: 'Contato', path: '' }
    ]

    return (
        <div className='bg-[#CFDA29] relative py-3 px-5 sm:px-7 md:px-14 xl:px-14 '>
            <div className="flex flex-col xl:flex-row items-center w-full">
                <div className="flex items-center justify-between lg:justify-evenly xl:justify-between w-full">
                    <div onClick={() => setOpenOpts(!openOpts)} className="block cursor-pointer z-20 lg:hidden xl:hidden"><IoReorderThreeOutline className="w-[38px] h-[38px] sm:w-[45px] sm:h-[45px] md:w-[50px] md:h-[50px]" /></div>
                    <div><LogoIcon className="w-[150px] sm:w-[160px] md:w-[180px] xl:w-[200px]" /></div>
                    <div className="hidden lg:flex xl:flex items-center justify-evenly ">
                        {links.map((link, index) => <a className="text-[#fff] truncate lg:mx-2 xl:mx-4 md:text-[16px] text-center lg:text-[18px] xl:text-[20px] font-semibold cursor-pointer hover:underline transition-all" key={index} href={link.path}>{link.text}</a>)}
                    </div>
                    <div className="items-center justify-center px-4 py-3 w-auto xl:w-[350px] rounded-full bg-white hidden xl:flex">
                        <div><IoIosSearch color="#CFDA29" size={25} /></div>
                        <input type="text" className="border-none w-full placeholder:text-black text-center bg-none bg-transparent outline-none" placeholder="O que você busca?" />
                    </div>
                    <div className="relative">
                        {shoppingCartSize && (<div className="p-2 flex justify-center items-center font-semibold w-[20px] h-[20px] border-white text-center  text-[14px] border rounded-full bg-[#fff] absolute top-0 right-0 z-20">{shoppingCartSize}</div>)}
                        <a href="/carrinho/sacola" className="cursor-pointer hover:opacity-70"><ShoppingCartIcon size={"57"} className="w-[45px] sm:w-[48px] md:w-[57px] xl:w-[57px]" /></a>
                    </div>
                    <a href="/login" className="hidden lg:block xl:block cursor-pointer hover:opacity-70"><UserIcon size={"61"} className="md:w-[50px] lg:w-[58px] xl:w-[61px]" /></a>
                </div>
                <div className="items-center justify-center p-2 sm:px-3 sm:py-2 md:px-4 md:py-3 lg:px-4 lg:py-3 w-full sm:w-[350px] lg:w-[350px] mt-3 rounded-full bg-white flex xl:hidden">
                    <div><IoIosSearch color="#CFDA29" size={25} /></div>
                    <input type="text" className="border-none w-full placeholder:text-black text-center text-[14px] md:text-[16px] lg:text-[16px] bg-none bg-transparent outline-none" placeholder="O que você busca?" />
                </div>
            </div>
        </div>
    )
}