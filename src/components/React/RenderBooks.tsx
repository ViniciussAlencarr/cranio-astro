import { useEffect, useState } from 'react';
import api from '../../api';

// css
import 'react-loading-skeleton/dist/skeleton.css';

// icons
import { FaPlus } from "react-icons/fa6";
import { SeeFlowsSkeleton } from './skeleton';

// types
interface Book {
    createdAt: string;
    id: number;
    price: number;
    publishedAt: string;
    authorName: string | null;
    updatedAt: string;
    cover: any;
    title: string;
}

const themes = [
    { color: 'CFDA29', value: 'Tema' },
    { color: 'B1BB1A', value: 'Tema' },
    { color: '8D9511', value: 'Tema' },
    { color: '5B610B', value: 'Tema' },
]

export const RenderBooks = ({ baseUrl = '' }) => {
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getBooks = async () => {
            try {
                const { data } = await api.get('books?populate=*')
                setBooks(data.data.map((book: any) => ({ ...book.attributes, cover: { ...book.attributes.cover.data?.attributes }, id: book.id, })))
                setLoading(false)
            } catch (err) {
                console.log(err)
            }
        }
        getBooks()
    }, [])

    const formatPrice = (price: number) => price.toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' })
    /* 
        if (loading) {
            return (
                <SeeFlowsSkeleton />
            )
        } */

    return (
        <>
            {loading && (
                <SeeFlowsSkeleton />
            )}
            <div className={`transition-opacity duration-500 ${loading ? 'opacity-0 h-0' : 'opacity-100 h-full'}`}>
                <div >
                    <div className="grid grid-cols-2 2xl:grid-cols-4 gap-2 md:gap-3 2xl:gap-4 w-full text-white">
                        {themes.map((theme, index) => <div key={index} style={{ background: `#${theme.color}` }} className={`w-full bg-[#${theme.color}] rounded-xl py-2 px-8 cursor-pointer hover:opacity-70 font-semibold text-[16px] md:text-[18px] lg:text-[20px] 2xl:text-[26px] text-center`}>{theme.value} {index + 1}</div>)}
                    </div>
                    <div className='bg-white rounded-xl my-6 md:my-8 2xl:my-11'>
                        {books.length !== 0 ? (<div className='flex rounded-lg flex-row flex-wrap'>
                            {books.slice(-12).map((book, index) => <a href={`/livro/${book.id}`} key={index} className='flex cursor-pointer flex-col flex-grow items-center rounded-lg text-center'>
                                <div className='py-2 px-1 md:p-3 2xl:p-6 items-center rounded-lg'>
                                    <img src={`${baseUrl}${book.cover.url}`} alt="" className='object-contain rounded-lg w-[122px] h-[190px] sm:w-[220px] sm:h-[300px] md:h-[420px] md:w-[300px] 2xl:h-[487px] 2xl:w-[340px] shadow-xl' />
                                </div>
                                <div className=''>
                                    <div className='text-[14px] md:text-[18px] 2xl:text-[26px]'>{book.title}</div>
                                    <div className='text-[#D76B2A] text-[12px] md:text-[14px] 2xl:text-[14px] mb-2 md:mb-3 2xl:mb-3'>{book.authorName}</div>
                                    <div className='text-[#CFDA29] text-[14px] md:text-[18px] 2xl:text-[26px] font-semibold'>{formatPrice(book.price || 0)}</div>
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
            </div>
        </>
    )
}