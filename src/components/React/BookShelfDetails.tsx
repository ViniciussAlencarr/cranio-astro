import { useEffect, useState } from "react";
import api from "../../api";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

// icons
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { AiFillStar } from "react-icons/ai";
import { RiBookMarkedLine } from "react-icons/ri";

// css
import '../../../index.css'
import 'react-loading-skeleton/dist/skeleton.css'

// types
interface Params {
    initialIndex: number;
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
    cover: any;
    publishedAt: string;
    authorName: string | null;
    updatedAt: string;
    title: string;
    product: Product;
}

export const BookhelfDetails = ({ baseUrl, initialIndex = 0 }: Params) => {
    const [books, setBooks] = useState<Book[]>([])
    const [username, setUsername] = useState('')
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = localStorage.getItem('user_id')
        const getShoppingCartProducts = async () => {
            try {
                const { data } = await api.get(`/purchases/${userId}`)
                setBooks(data.map((book: any) => book.itens).flat().sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
                setLoading(false)
            } catch (err) {
                console.log(err)
                setLoading(false)
            }
        }
        getShoppingCartProducts()
    }, [])

    useEffect(() => {
        const username = localStorage.getItem('user_name')
        if (username) setUsername(username)
    }, [])

    const formatPrice = (price: number) => price.toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' })

    const logOut = () => {
        localStorage.clear()
        window.location.href = window.location.origin
    }

    const displayBook = (index: any) => {
        const currentItem = books[index];
        if (currentItem) {

            return (
                <div className="flex flex-col items-start justify-center">
                    <div className="shadow-xl rounded-lg mb-6 self-center">
                        <img src={`${baseUrl}${currentItem.product.cover.url}`} alt="" className='object-contain rounded-lg w-full h-full sm:w-[220px] sm:h-[300px] md:h-[420px] md:w-[300px] 2xl:h-[487px] 2xl:w-[340px]' />
                    </div>
                    <div className="flex">
                        {
                            Array.from({ length: 5 }).map((_, index) => (
                                <div key={index}>
                                    <AiFillStar color="#FBB914" size={20} />
                                </div>
                            ))
                        }
                    </div>
                    <div className="mt-2 font-medium text-[16px] md:text-[20px] lg:text-[25px] 2xl:text-[30px]">
                        {currentItem?.product.title || 'Nome do livro'}
                    </div>
                    <div className="text-[#D76B2A] text-[14px] md:text-[16px] 2xl:text-[20px] font-normal">
                        {currentItem?.product?.authorName || 'Nome autor'}
                    </div>
                    <div className="flex items-start gap-1 mt-2">
                        <div><RiBookMarkedLine size={35} color="#FBB914" /></div>
                        <div className="flex flex-col">
                            <div className="text-[#9A9A9A] text-[10px] md:text-[12px]">Gênero</div>
                            <div className="font-semibold text-[12px] md:text-[14px]">{currentItem?.product?.gender || 'Abcdef'}</div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, books.length - 1));
    };

    const goToReadBook = (book: Product) => {
        window.location.href = `${window.location.origin}/${book.title}?book-id=${book.id}`
    }

    return (
        <>
            {loading && (
                <SkeletonTheme
                    borderRadius="0.5rem"
                    duration={4}
                >
                    <div className='h-full items-stretch flex flex-col'>
                        <Skeleton className='h-[50svh] box-border' width={'100%'} />
                        <Skeleton className='h-[180px] box-border mt-3' width={'100%'} />
                        <Skeleton className='h-[50px] box-border mt-3' width={'100%'} />
                    </div>
                </SkeletonTheme>
            )}
            <div className={`transition-opacity duration-500 ${loading ? 'opacity-0 h-0 w-0' : 'opacity-100 h-full'} `}>
                <div className="mt-8 sm:mt-0 flex h-full w-full justify-center items-baseline md:items-center gap-6">
                    <div onClick={handlePrev} className={`${currentIndex === 0 ? 'opacity-40' : 'cursor-pointer'} transition-all duration-300 `}><SlArrowLeft color={currentIndex === 0 ? 'grey' : "#D76B2A"} size={30} /></div>
                    <div className="block md:h-full">
                        <div className="flex flex-col justify-center h-full">
                            {displayBook(currentIndex)}
                            <div onClick={() => goToReadBook(books[currentIndex].product)} className="flex self-center my-3 md:my-6">
                                <button className="bg-[#EE8A21] text-white font-medium hover:opacity-70 rounded-full py-2 px-6 text-[14px] md:text-[16px]">Ler agora</button>
                            </div>
                        </div>
                    </div>
                    <div onClick={handleNext} className={`${currentIndex === (books.length - 1) ? 'opacity-40' : 'cursor-pointer'} transition-all duration-300`}><SlArrowRight color={currentIndex === (books.length - 1) ? 'grey' : "#D76B2A"} size={30} /></div>
                </div>
            </div>
        </>
    )
}