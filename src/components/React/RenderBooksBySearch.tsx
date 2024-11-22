import { useEffect, useState } from 'react';
import api from '../../api';

// css
import '../../../index.css'
import 'react-loading-skeleton/dist/skeleton.css';

// icons
import { FaCheck, FaPlus } from "react-icons/fa6";
import { SeeFlowsSkeleton } from './skeleton';
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowRight } from 'react-icons/md';

// types
interface Book {
    createdAt: string;
    id: number;
    price: number;
    theme: string;
    publishedAt: string;
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

export const RenderBooksBySearch = ({ baseUrl = '' }) => {
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(true);
    const [booksPerPage, setBooksPerPage] = useState(8)
    const [openFilters, setOpenFilters] = useState(false)
    const [queryParams, setQueryParams] = useState<any>();
    const [selectedFilter, setSelectedFilter] = useState({ key: 'recent', text: 'Mais recente' })

    const filters = [
        { key: 'recent', text: 'Mais recente' },
        { key: 'alph', text: 'Nome' },
        { key: 'price', text: 'Preço' },
    ]

    useEffect(() => {
        function listenQueryParamChanges() {
            function getQueryParams() {
                const params = new URLSearchParams(window.location.search);
                const queryParams: any = {};
                params.forEach((value, key) => {
                    queryParams[key] = value;
                });
                return queryParams;
            }

            function onURLChange() {
                const params = getQueryParams();
                setQueryParams(params.search);
                setBooksPerPage(8)
            }

            onURLChange();

            window.addEventListener('popstate', onURLChange);

            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;

            history.pushState = function (state, title, url) {
                originalPushState.call(history, state, title, url);
                onURLChange();
            };

            history.replaceState = function (state, title, url) {
                originalReplaceState.call(history, state, title, url);
                onURLChange();
            };
        }

        listenQueryParamChanges();
    }, []);

    useEffect(() => {
        selectedFilter.key === 'alph' && sortByTitle()
        selectedFilter.key === 'price' && sortByPrice()
        selectedFilter.key === 'recent' && sortByPublishDate()
        setBooksPerPage(8)
    }, [selectedFilter, queryParams])

    useEffect(() => {
        const getBooks = async () => {
            try {
                const { data } = await api.get('books?populate=cover,coupons,reviews.picture')
                const books = data.map((book: any) => ({ ...book, cover: { ...book.cover }, id: book.id, }))
                setBooks(books)
                setLoading(false)
            } catch (err) {
                console.log(err)
            }
        }
        getBooks()
    }, [])

    const formatPrice = (price: number) => price.toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' })

    const loadMoreBooks = () => setBooksPerPage(prev => prev + 8)

    const filterBooksByName = (books: Book[], name: string) => {
        return books.filter(book => book.title.toLowerCase().includes(name.toLowerCase().trim()));
    };

    const sortByTitle = () => {
        const sorted = [...books].sort((a, b) => a.title.localeCompare(b.title));
        setBooks(sorted);
    };

    const sortByPrice = () => {
        const sorted = [...books].sort((a, b) => a.price - b.price);
        setBooks(sorted);
    };

    const sortByPublishDate = () => {
        const sorted = [...books].sort((a: any, b: any) => (new Date(b.publishedAt) as any) - (new Date(a.publishedAt) as any));
        setBooks(sorted);
    };

    const filteredBooks = !!queryParams ? filterBooksByName(books, queryParams) : books;

    return (
        <div className="h-full block w-full py-3 px-5 sm:px-7 md:px-14 xl:px-14 ">
            {loading && (
                <SeeFlowsSkeleton />
            )}
            <div className={`transition-opacity duration-500 ${loading ? 'opacity-0 h-0' : 'opacity-100 h-full flex flex-col mt-0 md:mt-6'}`}>
                <div className='w-full gap-6 md:gap-8 2xl:gap-11 flex-col sm:flex-row items-center justify-center flex-1 flex'>
                    <div className='gap-x-3 text-center items-center justify-center flex-wrap flex font-medium text-[24px] sm:text-[24px] md:text-[30px] 2xl:text-[35px] flex-1'><span>Você buscou por:</span> <span className='break-all'>{queryParams}</span></div>
                    <span className='flex-1 text-center text-[20px]'>Encontramos {filteredBooks.length} Ebooks</span>
                </div>
                <div className='flex flex-wrap items-center justify-between my-4 md:my-6 2xl:my-8'>
                    <div className='flex flex-1 w-full gap-x-2 items-center'>
                        <a href='/' className='hover:underline text-[#969696]'>Home</a>
                        <span><MdOutlineKeyboardArrowRight size={25} /></span>
                        <span className='truncate'>{queryParams}</span>
                    </div>
                    <div className='hidden justify-end flex-1 sm:flex'>
                        <div className='flex text-[#969696] text-[16px] flex-col relative'>
                            <div onClick={() => setOpenFilters(!openFilters)} className='border gap-x-3 border-black relative z-30 bg-[#f4f4f4] cursor-pointer hover:bg-[#e4e4e4] duration-300 flex items-center rounded-full p-3'>
                                <span className=''>Ordernar por <span className='text-[#85CA4D]'>{selectedFilter.text}</span></span>
                                <span className={`${openFilters ? 'rotate-180' : ''} duration-300`}><MdOutlineKeyboardArrowDown size={25} /></span>
                            </div>
                            <div className={`${openFilters ? 'scale-100 opacity-100 translate-y-8' : 'scale-0 opacity-0 -translate-y-0 z-[-2]'} flex w-full bg-[#f4f4f4] gap-y-3 rounded-b-lg duration-300 ease-out transition-transform flex-col border-black border absolute top-0 pt-7 right-0 shadow-2xl p-3`}>
                                {filters.map((filter, index) =>
                                    <div key={index} onClick={() => { setSelectedFilter(filter); setOpenFilters(false) }} className={`flex cursor-pointer ${filter.key === selectedFilter.key && 'text-[#85CA4D]'}  hover:text-[#85CA4D] items-center justify-between`}>
                                        <span>{filter.text}</span>
                                        {filter.key === selectedFilter.key && (<span><FaCheck size={17} /></span>)}
                                    </div>)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='h-full flex flex-col'>
                    <div className='bg-white rounded-xl mb-6 md:mb-8 2xl:mb-11 flex-1'>
                        {filteredBooks.length !== 0 ? (<div className='flex rounded-lg flex-row flex-wrap'>
                            {filteredBooks.slice(0, booksPerPage).map((book, index) => <a href={`/livro/${book.id}`} key={index} className='flex cursor-pointer flex-col flex-grow items-center rounded-lg text-center'>
                                <div className='py-2 px-1 md:p-3 2xl:p-6 items-center rounded-lg'>
                                    <img src={`${baseUrl}${book.cover.url}`} alt="" className='object-fill md:object-contain rounded-lg w-[122px] h-[190px] sm:w-[220px] sm:h-[300px] md:h-[420px] md:w-auto 2xl:h-[487px] 2xl:w-auto shadow-xl' />
                                </div>
                                <div className=''>
                                    <div className='text-[14px] md:text-[18px] 2xl:text-[26px] max-w-[120px] md:max-w-none'>{book.title}</div>
                                    <div className='text-[#D76B2A] text-[12px] md:text-[14px] 2xl:text-[14px] mb-2 md:mb-3 2xl:mb-3'>{book.authorName}</div>
                                    <div className='text-[#CFDA29] text-[14px] md:text-[18px] 2xl:text-[26px] font-semibold'>{formatPrice(book.price || 0)}</div>
                                </div>
                            </a>)}
                        </div>)
                            : <div className='text-center py-6 h-full flex items-center justify-center'>Nenhum livro encontrado.</div>}
                        <div className='py-6 w-full flex justify-center items-center'>
                            {booksPerPage < filteredBooks.length && (<div onClick={loadMoreBooks} className='bg-[#EE8A21] cursor-pointer hover:opacity-70 transition-all rounded-full py-2 w-fit flex items-center text-white px-7'>
                                <div><FaPlus size={15} color='' /></div>
                                <span className='font-semibold pl-2 text-[12px] md:text-[14px] 2xl:text-[16px]'>Ver mais</span>
                            </div>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}