import { useEffect, useState } from "react";
import api from "../../api";

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

    useEffect(() => {
        const userId = localStorage.getItem('user_id')
        const getShoppingCartProducts = async () => {
            try {
                const { data } = await api.get(`/purchases/${userId}?populate=*`)
                setBooks(data.map((book: any) => ({ ...book, cover: { ...book.product?.cover }, id: book.id, })).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
            } catch (err) {
                console.log(err)
            }
        }
        getShoppingCartProducts()
    }, [])

    const formatPrice = (price: number) => price.toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' })

    const goToDetailShelfBooks = (indexOfBook: number) => window.location.href = `${window.location.origin}/estante/detalhes?index=${indexOfBook}`

    return (
        <div className="h-full pt-3">
            <div className="text-[30px] md:text-[35px] 2xl:text-[40px] pb-3 font-medium">Estante</div>
            <div>
                {books.length !== 0 ? (<div className='grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4'>
                    {books.slice(-12).map((book, index) => <div onClick={() => goToDetailShelfBooks(index)} key={index} className='flex cursor-pointer flex-col items-center text-center'>
                        <div className='py-2 px-1 md:p-3 2xl:p-6 items-center rounded-lg'>
                            <img src={`${baseUrl}${book.cover.url}`} alt="" className='object-contain w-[122px] rounded-lg h-[175px] sm:w-[220px] sm:h-[300px] md:h-[420px] md:w-[300px] 2xl:h-[487px] 2xl:w-[340px] shadow-xl' />
                        </div>
                        <div className=''>
                            <div className='text-[14px] md:text-[18px] 2xl:text-[26px]'>{book.product.title}</div>
                            <div className='text-[#D76B2A] text-[12px] md:text-[14px] 2xl:text-[14px] mb-2 md:mb-3 2xl:mb-3'>{book.product.authorName}</div>
                            <div className='text-[#CFDA29] text-[14px] md:text-[18px] 2xl:text-[26px] font-semibold'>{formatPrice(book.price)}</div>
                        </div>
                    </div>)}
                </div>)
                    : <div className='text-center py-6 text-[14px] md:text-[16px] 2xl:text-[20px] font-medium'>Você não tem livros.</div>}
            </div>
        </div>
    )
}