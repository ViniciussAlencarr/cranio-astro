import { useEffect, useState } from 'react';
import axios from 'axios'

// utils
import { CoverBookImg } from '../../utils/getSvgIcons'

// icons
import { FaPlus } from "react-icons/fa6";
import { SeeFlowsSkeleton } from './skeleton';

import api from '../../api';

interface Book {
    createdAt: string;
    id: number;
    price: number;
    publishedAt: string;
    authorName: string | null;
    updatedAt: string;
    title: string;
}

const themes = [
    { color: 'CFDA29', value: 'Tema' },
    { color: 'B1BB1A', value: 'Tema' },
    { color: '8D9511', value: 'Tema' },
    { color: '5B610B', value: 'Tema' },
]

export const RenderBooks = () => {
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getBooks = async () => {
            try {
                const { data } = await api.get('books')
                setBooks(data.data.map((book: any) => ({ ...book.attributes, id: book.id })))
                setLoading(false)
            } catch (err) {
                console.log(err)
            }
        }
        getBooks()
    }, [])

    const formatPrice = (price: number) => price.toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' })

    if (loading) {
        return (
            <SeeFlowsSkeleton />
        )
    }

    return (
        <div className="">
            <div className="grid grid-cols-2 2xl:grid-cols-4 gap-2 md:gap-3 2xl:gap-4 w-full text-white">
                {themes.map((theme, index) => <div key={index} style={{ background: `#${theme.color}` }} className={`w-full bg-[#${theme.color}] rounded-xl py-2 px-8 cursor-pointer hover:opacity-70 font-semibold text-[16px] md:text-[18px] lg:text-[20px] 2xl:text-[26px] text-center`}>{theme.value} {index + 1}</div>)}
            </div>
            <div className='bg-white rounded-xl my-6 md:my-8 2xl:my-11'>
                {books.length !== 0 ? (<div className='grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4'>
                    {books.slice(-12).map((book, index) => <a href={`/livro/${book.id}`} key={index} className='flex cursor-pointer flex-col items-center text-center'>
                        <div><CoverBookImg className='h-fit w-inherit max-w-[130px] sm:w-[180px] md:w-[210px] lg:w-[250px] sm:max-w-none 2xl:max-w-none 2xl:w-[340px]' /></div>
                        <div className=''>
                            <div className='text-[14px] md:text-[18px] 2xl:text-[26px]'>{book.title}</div>
                            <div className='text-[#D76B2A] text-[12px] md:text-[14px] 2xl:text-[14px] mb-2 md:mb-3 2xl:mb-3'>{book.authorName}</div>
                            <div className='text-[#CFDA29] text-[14px] md:text-[18px] 2xl:text-[26px] font-semibold'>{formatPrice(book.price)}</div>
                        </div>
                    </a>)}
                </div>)
                    : <div className='text-center py-6'>Nenhum livro encontrado.</div>}
                <div className='py-6 w-full flex justify-center items-center'>
                    <div className='bg-[#EE8A21] cursor-pointer hover:opacity-70 transition-all rounded-full py-2 w-fit flex items-center text-white px-7'>
                        <div><FaPlus size={15} color='' /></div>
                        <span className='font-semibold pl-2 text-[12px] md:text-[14px] 2xl:text-[16px]'>Ver mais</span>
                    </div>
                </div>
            </div>
        </div>
    )
}