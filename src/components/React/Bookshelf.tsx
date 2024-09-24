import { useState } from "react";

// icons
import { CiLogout } from "react-icons/ci";
import { LuUserSquare2 } from "react-icons/lu";

// utils
import { CoverBookImg } from "../../utils/getSvgIcons";

// types
interface Params {
    userId: string;
}

interface Book {
    createdAt: string;
    id: number;
    price: number;
    publishedAt: string;
    authorName: string | null;
    updatedAt: string;
    title: string;
}

export const Bookshelf = ({ }: Params) => {
    const [books] = useState<Book[]>([])

    const formatPrice = (price: number) => price.toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' })

    return (
        <div className="h-full w-full block">
            <div className="h-full flex flex-col">
                <div className="hidden sm:block w-full">
                    <div className="flex justify-between items-center text-[14px] md:text-[16px] 2xl:text-[20px]">
                        <div className="flex flex-row items-center">
                            <div><LuUserSquare2 className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] 2xl:w-[65px] 2xl:h-[65px]" /></div>
                            <div className="ml-3 2xl:ml-6 font-medium">Nome usuário</div>
                        </div>
                        <div className="flex flex-row items-center cursor-pointer hover:opacity-70">
                            <div><CiLogout color="#F7262E" className="w-[20px] h-[20px] md:w-[25px] md:h-[25px] 2xl:w-[30px] 2xl:h-[30px]" /></div>
                            <div className="font-semibold ml-3 2xl:ml-6">Sair</div>
                        </div>
                    </div>
                </div>
                <div className="h-full pt-3">
                    <div className="text-[30px] md:text-[35px] 2xl:text-[40px] pb-3 font-medium">Estante</div>
                    <div>
                        {books.length !== 0 ? (<div className='grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4'>
                            {books.slice(-12).map((book, index) => <div key={index} className='flex cursor-pointer flex-col items-center text-center'>
                                <div><CoverBookImg className='h-fit w-inherit max-w-[130px] sm:w-[180px] md:w-[210px] lg:w-[250px] sm:max-w-none 2xl:max-w-none 2xl:w-[340px]' /></div>
                                <div className=''>
                                    <div className='text-[14px] md:text-[18px] 2xl:text-[26px]'>{book.title}</div>
                                    <div className='text-[#D76B2A] text-[12px] md:text-[14px] 2xl:text-[14px] mb-2 md:mb-3 2xl:mb-3'>{book.authorName}</div>
                                    <div className='text-[#CFDA29] text-[14px] md:text-[18px] 2xl:text-[26px] font-semibold'>{formatPrice(book.price)}</div>
                                </div>
                            </div>)}
                        </div>)
                            : <div className='text-center py-6 text-[14px] md:text-[16px] 2xl:text-[20px] font-medium'>Você não tem livros.</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}