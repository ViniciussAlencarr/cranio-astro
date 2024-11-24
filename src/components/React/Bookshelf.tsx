import { useEffect, useState } from "react";
import api from "../../api";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import '../../../index.css'
import 'react-loading-skeleton/dist/skeleton.css';

// types
interface Params {
    baseUrl: string;
}

interface Product {
    authorName: string;
    ebook: boolean;
    edition: string;
    gender: string;
    id: number;
    indicatedAge: string;
    isbnCode: string;
    language: string;
    cover: any;
    pages: number;
    price: number;
    publishedAt: string;
    publisher: string;
    synopsis: string;
    title: string;
    year: number;
}

interface Book {
    createdAt: string;
    id: number;
    price: number;
    publishedAt: string;
    authorName: string | null;
    cover: any;
    updatedAt: string;
    title: string;
    product: Product;
}

export const Bookshelf = ({ baseUrl }: Params) => {
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = localStorage.getItem('user_id')
        const getShoppingCartProducts = async () => {
            try {
                const { data } = await api.get(`/purchases/${userId}?populate=*`)
                setBooks(data.map((book: any) => book.itens).flat().sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
                setLoading(false)
            } catch (err) {
                console.log(err)
                setLoading(false)
            }
        }
        getShoppingCartProducts()
    }, [])

    const goToDetailShelfBooks = (indexOfBook: number) => window.location.href = `${window.location.origin}/estante/detalhes?index=${indexOfBook}`

    return (
        <>
            {loading && (
                <SkeletonTheme
                    borderRadius="0.5rem"
                    duration={4}
                >
                    <div className='h-full items-stretch flex flex-col'>
                        <Skeleton className='w-[20px] h-[60px] mt-3' />
                        <Skeleton className='h-[69svh] box-border my-6 md:my-8 2xl:my-11' width={'100%'} />
                    </div>
                </SkeletonTheme>
            )}
            <div className={`transition-opacity duration-500 ${loading ? 'opacity-0 h-0 w-0' : 'opacity-100 h-full pt-3'}`}>
                <div className="text-[30px] md:text-[35px] 2xl:text-[40px] pb-3 font-medium">Estante</div>
                <div>
                    {books.length !== 0 ? (<div className='grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4'>
                        {books.slice(-12).map((book, index) => <div onClick={() => goToDetailShelfBooks(index)} key={index} className='flex cursor-pointer flex-col items-center text-center'>
                            <div className='py-2 px-1 md:p-3 2xl:p-6 items-center rounded-lg'>
                                <img src={`${baseUrl}${book.product.cover.url}`} alt="" className='object-contain w-[122px] rounded-lg h-auto sm:w-[220px] md:w-[300px] 2xl:w-[340px] shadow-xl' />
                            </div>
                            <div className=''>
                                <div className='text-[14px] md:text-[18px] 2xl:text-[26px]'>{book.product.title}</div>
                                <div className='text-[#D76B2A] text-[12px] md:text-[14px] 2xl:text-[14px] mb-2 md:mb-3 2xl:mb-3'>{book.product.authorName}</div>
                            </div>
                        </div>)}
                    </div>)
                        : <div className='text-center py-6 text-[14px] md:text-[16px] 2xl:text-[20px] font-medium'>Você não tem livros.</div>}
                </div>
            </div>
        </>
    )
}