import { useEffect, useState } from 'react';
import api from '../../api';

// css
import '../../../index.css'
import 'react-loading-skeleton/dist/skeleton.css';

// icons
import { FaPlus } from "react-icons/fa6";
import { SeeFlowsSkeleton } from './skeleton';
import { IoMdClose } from "react-icons/io";

// types
interface Book {
    createdAt: string;
    id: number;
    price: number;
    theme: string;
    publishedAt: string;
    discount: number;
    authorName: string | null;
    updatedAt: string;
    cover: any;
    title: string;
}

interface ThemeColors {
    CFDA29: string;
    B1BB1A: string;
    '8D9511': string;
    '5B610B': string;
}

interface Theme {
    color: keyof ThemeColors;
    value: string;
}

export const RenderBooks = ({ baseUrl = '' }) => {
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(true);
    const [booksPerPage, setBooksPerPage] = useState(8)
    const [themes, setThemes] = useState<Theme[]>([])
    const [selectedTheme, setSelectedTheme] = useState<Theme>();

    useEffect(() => {
        const getBooks = async () => {
            try {
                const { data } = await api.get('books?populate=cover,coupons,reviews.picture')
                const books = data.map((book: any) => ({ ...book, cover: { ...book.cover }, discount: buildCouponValue(book.coupons), id: book.id, }))
                setBooks(books)
                setThemes(buildThemes(books))
                setLoading(false)
            } catch (err) {
                console.log(err)
            }
        }
        getBooks()
    }, [])

    const buildThemes = (books: Book[]): Theme[] => {
        const themasSet = new Set();

        books.forEach(book => {
            if (book.theme) {
                const temas = book.theme.split(/[,;|/]/).map(theme => theme.trim());
                temas.forEach(theme => themasSet.add(theme));
            }
        });

        const colors: Array<keyof ThemeColors> = ['CFDA29', 'B1BB1A', '8D9511', '5B610B'];
        const temasUnicos = Array.from(themasSet)

        return temasUnicos.map((tema, index) => ({
            value: tema as string,
            color: colors[index % colors.length]
        }));
    };

    const buildCouponValue = (coupons: any[]) => {
        if (coupons.length === 0) return 0;

        return coupons.reduce((acc, coupon) => acc + coupon.value, 0)
    }

    const formatPrice = (price: number) => price.toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' })

    const loadMoreBooks = () => setBooksPerPage(prev => prev + 8)

    const filtrarLivrosPorTema = (books: Book[], theme: Theme) => {
        return books.filter(book => {
            if (book.theme) {
                const temas = book.theme.split(/[,;|/]/).map(theme => theme.trim());
                return temas.includes(theme.value);
            }
            return false;
        });
    };


    const filteredBooks = selectedTheme ? filtrarLivrosPorTema(books, selectedTheme) : books;

    return (
        <>
            {loading && (
                <SeeFlowsSkeleton />
            )}
            <div className={`transition-opacity duration-500 ${loading ? 'opacity-0 h-0' : 'opacity-100 h-full'}`}>
                <div className='h-full flex flex-col'>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap flex-nowrap gap-2 md:gap-3 2xl:gap-4 w-full text-white">
                        {themes.map((theme, index) => <div key={index} style={{ background: `#${theme.color}` }} className={`min-w-fit flex-1 w-full flex items-center justify-between bg-[#${theme.color}] rounded-xl py-2 px-8 cursor-pointer hover:opacity-70 font-semibold text-[16px] md:text-[18px] lg:text-[20px] 2xl:text-[26px] text-center`}><span onClick={() => setSelectedTheme(theme)} className='flex-1'>{theme.value}</span> {theme === selectedTheme && (<span onClick={() => setSelectedTheme(undefined)}><IoMdClose className="w-[20px] h-[20px] md:w-[25px] md:h-[25px]" /></span>)}</div>)}
                    </div>
                    <div className='bg-white rounded-xl my-6 md:my-8 2xl:my-11 flex-1'>
                        {filteredBooks.length !== 0 ? (<div className='flex rounded-lg flex-row flex-wrap'>
                            {filteredBooks.slice(0, booksPerPage).map((book, index) => <a href={`/livro/${book.id}`} key={index} className='flex cursor-pointer flex-col flex-grow items-center rounded-lg text-center'>
                                <div className='py-2 px-1 md:p-3 2xl:p-6 items-center rounded-lg'>
                                    <img src={`${baseUrl}${book.cover.url}`} alt="" className='object-fill md:object-contain rounded-lg w-[122px] h-[190px] sm:w-[220px] sm:h-[300px] md:h-[420px] md:w-auto 2xl:h-[487px] 2xl:w-auto shadow-xl' />
                                </div>
                                <div className=''>
                                    <div className='text-[14px] md:text-[18px] 2xl:text-[26px] max-w-[120px] md:max-w-none'>{book.title}</div>
                                    <div className='text-[#D76B2A] text-[12px] md:text-[14px] 2xl:text-[14px] mb-2 md:mb-3 2xl:mb-3'>{book.authorName}</div>
                                    {book.discount !== 0 && (<div className="line-through text-[#636363] text-[12px] md:text-[14px] 2xl:text-[16px]">{formatPrice(book.price)}</div>)}
                                    <div className='text-[#CFDA29] text-[14px] md:text-[18px] 2xl:text-[26px] font-semibold'>{formatPrice((book.price - book.discount) || 0)}</div>
                                </div>
                            </a>)}
                        </div>)
                            : <div className='text-center py-6 h-full flex items-center justify-center'>Nenhum livro encontrado.</div>}
                        <div className='py-6 w-full flex justify-center items-center'>
                            {booksPerPage < books.length && (<div onClick={loadMoreBooks} className='bg-[#EE8A21] cursor-pointer hover:opacity-70 transition-all rounded-full py-2 w-fit flex items-center text-white px-7'>
                                <div><FaPlus size={15} color='' /></div>
                                <span className='font-semibold pl-2 text-[12px] md:text-[14px] 2xl:text-[16px]'>Ver mais</span>
                            </div>)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}