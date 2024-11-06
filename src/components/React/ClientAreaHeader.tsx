import { useEffect, useState } from "react"

// icons
import { IoReorderThreeOutline } from "react-icons/io5"
import { LogoIcon } from "../../utils/getSvgIcons"

// utils
import { validateTokenJwt } from "../../utils/validateJwt"
import { LuUserSquare2 } from "react-icons/lu"
import { CiLogout } from "react-icons/ci"
import { IoMdClose } from "react-icons/io"

export const ClientAreaHeader = () => {
    const [openOpts, setOpenOpts] = useState(false);
    const [userName, setUserName] = useState('')

    useEffect(() => {
        const username = localStorage.getItem('user_name')
        setUserName(username as string || 'Seu nome')
    }, [])

    const logOut = () => {
        console.log('sair')
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

        <div className='bg-[#CFDA29] relative py-3 px-5 sm:px-7 md:px-14 xl:px-14 '>
            <div className="flex flex-col sm:relative sm:flex-row items-center justify-center">
                <div className="flex-1 flex justify-center items-center w-full">
                    {openOpts && (<div className="w-[38px] h-[38px] sm:w-[45px] sm:h-[45px] md:w-[50px] md:h-[50px]"></div>)}
                    <div onClick={() => setOpenOpts(!openOpts)} className={`block cursor-pointer z-20 lg:hidden xl:hidden ${openOpts && 'fixed'} left-5 md:left-14 xl:left-14`}>
                        <>
                            {openOpts ? (<IoMdClose className="w-[38px] h-[38px] sm:w-[45px] sm:h-[45px] md:w-[50px] md:h-[50px]" />) : (<IoReorderThreeOutline className="w-[38px] h-[38px] sm:w-[45px] sm:h-[45px] md:w-[50px] md:h-[50px]" />)}
                        </>
                    </div>
                    <a href="/" className=" flex-1 justify-center flex"><LogoIcon className="w-[150px] sm:w-[160px] md:w-[180px] xl:w-[200px]" /></a>
                </div>
                <div className="font-semibold text-[14px] md:text-[16px] 2xl:text-[20px] sm:absolute sm:right-0">Área do cliente</div>
            </div>
            <div className={`${openOpts ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 lg:hidden xl:hidden fixed z-10 left-0 w-[calc(100%-5rem)] bg-white p-3 top-0 h-svh border shadow-xl shadow-gray-700 rounded-br-2xl`}>
                <div className="pt-[10vh] py-3 px-5 sm:px-7 md:px-14 xl:px-14 top-[10vh] h-full w-full left-0 flex flex-col">
                    <div onClick={goToAccount} className="flex flex-row items-center cursor-pointer">
                        <div><LuUserSquare2 className="w-[50px] h-[50px] md:w-[65px] md:h-[65px] 2xl:w-[75px] 2xl:h-[75px]" /></div>
                        <div className="ml-3 2xl:ml-6 font-medium text-[20px]">{userName}</div>
                    </div>
                    <div onClick={goToBooks} className="mt-6 cursor-pointer">
                        <span className="text-[20px] font-semibold text-[#CFDA29] hover:underline cursor-pointer">Livros</span>
                    </div>
                    <div className="content-end flex-1">
                        <button onClick={() => logOut()}  className="flex flex-row items-center cursor-pointer hover:opacity-70">
                            <div><CiLogout color="#F7262E" className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] 2xl:w-[50px] 2xl:h-[50px]" /></div>
                            <div className="font-semibold ml-3 2xl:ml-6 text-[20px]">Sair</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}