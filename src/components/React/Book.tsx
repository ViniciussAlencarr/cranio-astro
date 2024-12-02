import { useCallback, useEffect, useState } from "react"
import api from "../../api"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"

// icons
import { AiFillStar } from "react-icons/ai"
import { CiCalendar } from "react-icons/ci"
import { HiOutlineDocument } from "react-icons/hi2"
import { ImBarcode } from "react-icons/im"
import { MdKeyboardArrowRight, MdOutlinePhonelinkRing } from "react-icons/md"
import { RiGroupLine } from "react-icons/ri"
import { TfiWorld } from "react-icons/tfi"
import { FiUser } from "react-icons/fi"

// utils
import { getShoppingInCart } from "../../utils/getShoppingItems"
import { validateTokenJwt } from "../../utils/validateJwt"

// css
import '../../../index.css'
import 'react-loading-skeleton/dist/skeleton.css'

// types
interface Book {
    id: string;
    authorName: string;
    createdAt: string;
    price: number;
    publishedAt: string;
    title: string;
    updatedAt: string;
    discount: number;
    gender: string;
    edition: string;
    indicatedAge: string;
    isbnCode: string;
    language: string;
    cover: any;
    pages: number;
    purchased?: boolean;
    inShoppingCart?: boolean;
    publisher: string;
    synopsis: string;
    year: number;
    ebook: boolean;
}

interface Review {
    assessment: number;
    createdAt: string;
    evaluatorName: string;
    id: number;
    message: string;
    publishedAt: string;
    updatedAt: string;
    picture: any;
}

export const Book = ({ id = '', baseUrl = '' }) => {
    const [book, setBook] = useState<Book>()
    const [reviews, setReviews] = useState<Review[]>()
    const [reviewsAverage, setReviewsAverage] = useState(0)
    const [isLogged, setIsLogged] = useState(false)

    useEffect(() => {
        if (reviews) {
            const sum = reviews.reduce((acc, review) => acc + review.assessment, 0);
            const average = sum / reviews.length;
            setReviewsAverage(average)
        }
    }, [reviews])

    useEffect(() => {
        const tokenExpired = validateTokenJwt()
        setIsLogged(!tokenExpired)
    }, [])

    useEffect(() => {
        getBookById()
    }, [])

    const getBookById = useCallback(async () => {
        try {
            const userId = localStorage.getItem('user_id') as string
            const url = `/books/${id}?populate=cover,coupons,reviews.picture${userId ? `&userId=${userId}`: ''}`
            const { data } = await api.get(url)

            setBook({ ...data, cover: { ...data.cover }, discount: buildCouponValue(data.coupons), id: data.id })
            setReviews(data.reviews.map((review: any) => ({ ...review, picture: { ...review.picture } })))
        } catch (err) {
            console.log(err)
        }
    }, [book, reviews])

    const formatPrice = (price: number) => price.toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' })

    const getPublishedYear = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.getFullYear();
    }

    const buildCouponValue = (coupons: any[]) => {
        if (coupons.length === 0) return 0;

        return coupons.reduce((acc, coupon) => acc + coupon.value, 0)
    }

    const formatISODate = (isoDate: string) => {
        const date = new Date(isoDate);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    const formatISBN = (isbn: string | undefined) => {
        if (!isbn) return undefined
        // Remove todos os caracteres não numéricos e 'X'
        const cleaned = isbn.replace(/[^0-9X]/gi, '');

        if (cleaned.length === 10) {
            // Formato ISBN-10: x-xxxx-xxxx-x
            return cleaned.replace(/(\d{1})(\d{4})(\d{4})(\d{1})/, '$1-$2-$3-$4');
        } else if (cleaned.length === 13) {
            // Formato ISBN-13: xxx-x-xxxx-x-xxx
            return cleaned.replace(/(\d{3})(\d{1})(\d{5})(\d{4})(\d{1})/, '$1-$2-$3-$4-$5');
        } else {
            // Retorna o valor limpo sem formatação se não for um ISBN válido
            return cleaned;
        }
    };

    const createCartProduct = async () => {
        if (!book || Object.keys(book).length === 0) return;
        try {
            const userId = localStorage.getItem('user_id') as string
            await api.post('/add-to-cart', {
                data: {
                    productId: JSON.stringify(book.id),
                    price: book.price,
                    bookAuthor: book.authorName,
                    bookTitle: book.title,
                    amount: 1,
                    customerId: userId
                }
            })
            updateSizeOfShoppingCart()
        } catch (err) {
            throw err
        }
    }

    const getShoppingCartProducts = async () => {
        try {
            const { data } = await getShoppingInCart()
            localStorage.setItem('shoppingCartSize', JSON.stringify(data.length))
        } catch (err) {
            console.log(err)
        }
    }

    const updateSizeOfShoppingCart = () => {
        getShoppingCartProducts()
        const event = new Event('UpdateShoppingCartSize')
        document.dispatchEvent(event)
        window.location.reload()
    }

    const addToCart = async () => {
        if (!isLogged) {
            return window.location.href = `${window.location.origin}/login`
        }

        await createCartProduct()
    }

    const shopNow = async () => {
        if (!isLogged) {
            return window.location.href = `${window.location.origin}/login`
        }

        await createCartProduct()
        window.location.href = `${window.location.origin}/carrinho/sacola`
    }

    const goToShoppingCart = () => {
        if (!isLogged) {
            return window.location.href = `${window.location.origin}/login`
        }

        window.location.href = `${window.location.origin}/carrinho/sacola`
    }

    const goToBookShelf = () => {
        if (!isLogged) {
            return window.location.href = `${window.location.origin}/estante`
        }

        window.location.href = `${window.location.origin}/estante`
    }

    return (
        <>
            <div className=" h-full flex flex-col">
                {!book && (
                    <SkeletonTheme
                        borderRadius="0.5rem"
                        duration={4}
                    >
                        <div className='h-full items-stretch flex flex-col py-3 px-5 sm:px-7 md:px-14 md:py-3 xl:py-6 xl:px-14'>
                            <Skeleton className='w-[20px] h-[20px]' />
                            <Skeleton className='h-[100svh] box-border p-3 mt-3 2xl:mt-6' width={'100%'} />
                        </div>
                    </SkeletonTheme>
                )}
                <div className={`transition-opacity duration-500 ${!book ? 'opacity-0 h-0' : 'opacity-100 h-full'} py-3 px-5 sm:px-7 md:px-14 md:py-3 xl:py-6 xl:px-14`}>
                    <div className="w-full block">
                        <div
                            className="flex items-center justify-start gap-1 2xl:gap-2 text-[10px] sm:text-[12px] md:text-[14px] 2xl:text-[16px]">
                            <a href="/" className="text-[#969696] hover:underline">Home</a>
                            <div>
                                <MdKeyboardArrowRight color="#969696" size={20} />
                            </div>
                            <a href="/livros" className="text-[#969696] hover:underline">Livros</a>
                            <div>
                                <MdKeyboardArrowRight color="#000" size={20} />
                            </div>
                            <div>{book?.title || 'Nome do livro'}</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-3 mt-3 2xl:mt-6">
                        <div className="flex flex-row justify-center items-start md:justify-start">
                            <div className="pr-3 rounded-lg">
                                {book?.cover.url && <img src={`${baseUrl}${book?.cover.url}`} alt="" className='object-contain rounded-lg h-min max-h-min w-inherit max-w-[100px] sm:w-[180px] md:w-[210px] lg:w-[250px] sm:max-w-none 2xl:max-w-none 2xl:h-[368px] 2xl:w-[257px] shadow-xl' />}
                            </div>
                            <div className="flex flex-col h-full items-baseline justify-start mt-3">
                                <div className="block w-full">
                                    <div className="flex items-center justify-start">
                                        {
                                            Array.from({ length: reviewsAverage }).map((_, index) => (
                                                <div key={index}>
                                                    <AiFillStar color="#FBB914" size={20} />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className="font-medium text-[12px] sm:text-[14px] md:text-[20px] lg:text-[25px] 2xl:text-[30px]">
                                    {book?.title || 'Nome do livro'}
                                </div>
                                <div className="mt-2 text-[#D76B2A] text-[14px] md:text-[16px] 2xl:text-[20px] font-normal">
                                    {book?.authorName || 'Nome autor'}
                                </div>
                                <div
                                    className="text-[#CFDA29] flex flex-wrap items-center gap-x-3 text-[24px] sm:text-[27px] md:text-[35px] lg:text-[38px] 2xl:text-[40px] font-semibold">
                                    <span>{formatPrice(((book?.price as number) - (book?.discount as number)) || 0)}</span>
                                    {(book?.discount as number) !== 0 && <span className="line-through text-[#636363] text-[12px] md:text-[14px] 2xl:text-[16px]">{formatPrice(book?.price || 0)}</span>}
                                </div>
                                <div className="hidden sm:flex 2xl:flex flex-row items-center gap-3 mt-6">
                                    <div className="block">
                                        <div className="flex flex-row gap-2">
                                            <div className="flex items-center">
                                                <HiOutlineDocument size={30} color="#FBB914" />
                                            </div>
                                            <div className="flex flex-col justify-start">
                                                <div className="text-[10px] text-[#9A9A9A] leading-[18px]">
                                                    Páginas<br />
                                                    <span className="font-medium 2xl:text-[14px] leading-0 text-black">{book?.pages || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="block">
                                        <div className="flex flex-row gap-2">
                                            <div className="flex items-center">
                                                <TfiWorld size={25} color="#FBB914" />
                                            </div>
                                            <div className="flex flex-col justify-start">
                                                <div className="text-[10px] text-[#9A9A9A] leading-[18px]">
                                                    Idioma<br />
                                                    <span className="font-medium 2xl:text-[14px] leading-0 text-black">{book?.language || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="block">
                                        <div className="flex flex-row gap-2">
                                            <div className="flex items-center">
                                                <RiGroupLine size={25} color="#FBB914" />
                                            </div>
                                            <div className="flex flex-col justify-start">
                                                <div className="text-[10px] text-[#9A9A9A] leading-[18px]">
                                                    Idade indicada<br />
                                                    <span className="font-medium 2xl:text-[14px] leading-0 text-black">{book?.indicatedAge || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="block">
                                        <div className="flex flex-row gap-2">
                                            <div className="flex items-center">
                                                <CiCalendar size={30} color="#FBB914" />
                                            </div>
                                            <div className="flex flex-col justify-start">
                                                <div className="text-[10px] text-[#9A9A9A] leading-[18px]">
                                                    Ano de publicação<br />
                                                    <span className="font-medium 2xl:text-[14px] leading-0 text-black">{book?.publishedAt ? getPublishedYear(book.publishedAt) : 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden sm:flex 2xl:flex flex-row items-center gap-6 mt-3">
                                    <div className="block">
                                        <div className="flex flex-row gap-2">
                                            <div className="flex items-center">
                                                <ImBarcode size={25} color="#FBB914" />
                                            </div>
                                            <div className="flex flex-col justify-start">
                                                <div className="text-[10px] text-[#9A9A9A] leading-[18px]">
                                                    Código ISBN<br />
                                                    <span
                                                        className="font-medium 2xl:text-[14px] leading-0 text-black">{formatISBN(book?.isbnCode) || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {book?.ebook && (<div className="block">
                                        <div className="flex flex-row gap-2">
                                            <div className="flex items-center">
                                                <MdOutlinePhonelinkRing size={25} color="#FBB914" />
                                            </div>
                                            <div className="flex flex-col justify-start">
                                                <div className="text-[10px] text-[#9A9A9A] leading-[18px]">
                                                    Formato<br />
                                                    <span className="font-medium 2xl:text-[14px] leading-0 text-black">Ebook</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>)}
                                </div>
                                {book?.purchased ? (
                                    <div className="mt-1 md:mt-3 2xl:mt-6 block w-full">
                                        <div>
                                            <button onClick={goToBookShelf} className="bg-[#CFDA29] rounded-full py-1 px-3 md:py-2 md:px-12 2xl:py-2 2xl:px-12 text-white font-semibold hover:opacity-70 text-[10px] sm:text-[12px] md:text-[14px] 2xl:text-[16px]">Na estante</button>
                                        </div>
                                    </div>
                                ) : !book?.inShoppingCart ? (<div className="mt-1 md:mt-3 2xl:mt-6 block w-full">
                                    <div className="flex flex-col sm:flex-row 2xl:flex-row items-start">
                                        <div>
                                            <button onClick={() => addToCart()}
                                                className="bg-[#CFDA29] rounded-full py-1 px-3 md:py-2 md:px-12 2xl:py-2 2xl:px-12 text-white font-semibold hover:opacity-70 text-[10px] sm:text-[12px] md:text-[14px] 2xl:text-[16px]">Adicionar ao
                                                carrinho</button>
                                        </div>
                                        <div className="ml-0 mt-2 sm:mt-0 sm:ml-2 2xl:mt-0 2xl:ml-3">
                                            <button
                                                onClick={() => shopNow()}
                                                className="bg-[#EE8A21] rounded-full py-1 px-3 md:py-2 md:px-12 2xl:py-2 2xl:px-12 text-white font-semibold hover:opacity-70 text-[10px] sm:text-[12px] md:text-[14px] 2xl:text-[16px]">Comprar
                                                agora</button>
                                        </div>
                                    </div>
                                </div>)
                                    : (
                                        <div className="mt-1 md:mt-3 2xl:mt-6 block w-full">
                                            <div>
                                                <button onClick={goToShoppingCart} className="bg-[#CFDA29] rounded-full py-1 px-3 md:py-2 md:px-12 2xl:py-2 2xl:px-12 text-white font-semibold hover:opacity-70 text-[10px] sm:text-[12px] md:text-[14px] 2xl:text-[16px]">No carrinho</button>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>
                        <div className="w-full mt-3 sm:hidden">
                            <div className="flex flex-col items-center gap-2 mt-6">
                                <div className="flex flex-row w-full items-center gap-2">
                                    <div className="block">
                                        <div className="flex flex-row gap-2">
                                            <div className="flex items-center">
                                                <HiOutlineDocument size={25} color="#FBB914" />
                                            </div>
                                            <div className="flex flex-col justify-start">
                                                <div className="text-[8px] text-[#9A9A9A] leading-[12px]">
                                                    Páginas<br />
                                                    <span
                                                        className="font-medium text-[10px] md:text-[12px] 2xl:text-[14px] leading-0 text-black">{book?.pages || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="block">
                                        <div className="flex flex-row gap-2">
                                            <div className="flex items-center">
                                                <TfiWorld size={20} color="#FBB914" />
                                            </div>
                                            <div className="flex flex-col justify-start">
                                                <div className="text-[8px] text-[#9A9A9A] leading-[12px]">
                                                    Idioma<br />
                                                    <span
                                                        className="font-medium text-[10px] md:text-[12px] 2xl:text-[14px] leading-0 text-black">{book?.language || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row w-full items-center gap-2">
                                    <div className="block">
                                        <div className="flex flex-row gap-2">
                                            <div className="flex items-center">
                                                <RiGroupLine size={20} color="#FBB914" />
                                            </div>
                                            <div className="flex flex-col justify-start">
                                                <div className="text-[8px] text-[#9A9A9A] leading-[12px]">
                                                    Idade indicada<br />
                                                    <span
                                                        className="font-medium text-[10px] md:text-[12px] 2xl:text-[14px] leading-0 text-black">{book?.indicatedAge || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="block">
                                        <div className="flex flex-row gap-2">
                                            <div className="flex items-center">
                                                <CiCalendar size={25} color="#FBB914" />
                                            </div>
                                            <div className="flex flex-col justify-start">
                                                <div className="text-[8px] text-[#9A9A9A] leading-[12px]">
                                                    Ano de publicação<br />
                                                    <span
                                                        className="font-medium text-[10px] md:text-[12px] 2xl:text-[14px] leading-0 text-black">{book?.publishedAt ? getPublishedYear(book.publishedAt) : 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row items-center gap-6">
                                <div className="block">
                                    <div className="flex flex-row gap-2">
                                        <div className="flex items-center">
                                            <ImBarcode size={20} color="#FBB914" />
                                        </div>
                                        <div className="flex flex-col justify-start">
                                            <div className="text-[8px] text-[#9A9A9A] leading-[12px]">
                                                Código ISBN<br />
                                                <span
                                                    className="font-medium text-[10px] md:text-[12px] 2xl:text-[14px] leading-0 text-black">{formatISBN(book?.isbnCode) || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {book?.ebook && (<div className="block">
                                    <div className="flex flex-row gap-2">
                                        <div className="flex items-center">
                                            <MdOutlinePhonelinkRing size={20} color="#FBB914" />
                                        </div>
                                        <div className="flex flex-col justify-start">
                                            <div className="text-[8px] text-[#9A9A9A] leading-[12px]">
                                                Formato<br />
                                                <span
                                                    className="font-medium text-[10px] md:text-[12px] 2xl:text-[14px] leading-0 text-black">Ebook</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>)}
                            </div>
                        </div>
                        <div className="mt-6 border border-[#CFDA29] rounded-xl p-3">
                            <div className="flex flex-col">
                                <div className="text-[#DDCC13] text-[14px] md:text-[16px] 2xl:text-[18px] font-medium">Sinopse</div>
                            </div>
                            <div className="mt-2 sm:mt-3 2xl:mt-3">
                                <p className="p-0 m-0 text-start text-[12px] md:text-[14px] 2xl:text-[16px]">
                                    {book?.synopsis || 'N/A'}
                                </p>
                            </div>
                            <div className="text-[#DDCC13] text-[14px] md:text-[16px] 2xl:text-[18px] font-medium mt-2 sm:mt-3 2xl:mt-3">Especificações do Produto</div>
                            <div className="flex flex-col justify-center mt-2 sm:mt-3 2xl:mt-3">
                                <div className="flex justify-between w-full text-[12px] md:text-[14px] 2xl:text-[16px]">
                                    <div className="list-item font-semibold ml-5">Autor(a)</div>
                                    <div className="font-normal  text-[#636363] text-end">{book?.authorName || 'N/A'}</div>
                                </div>
                                <div className="flex justify-between w-full text-[12px] md:text-[14px] 2xl:text-[16px]">
                                    <div className="list-item font-semibold ml-5">Gênero</div>
                                    <div className="font-normal  text-[#636363] text-end">{book?.gender || 'N/A'}</div>
                                </div>
                                <div className="flex justify-between w-full text-[12px] md:text-[14px] 2xl:text-[16px]">
                                    <div className="list-item font-semibold ml-5">Editora</div>
                                    <div className="font-normal  text-[#636363] text-end">{book?.publisher || 'N/A'}</div>
                                </div>
                                <div className="flex justify-between w-full text-[12px] md:text-[14px] 2xl:text-[16px]">
                                    <div className="list-item font-semibold ml-5">Páginas</div>
                                    <div className="font-normal  text-[#636363] text-end">{book?.pages || 'N/A'}</div>
                                </div>
                                <div className="flex justify-between w-full text-[12px] md:text-[14px] 2xl:text-[16px]">
                                    <div className="list-item font-semibold ml-5">Ano</div>
                                    <div className="font-normal  text-[#636363] text-end">{book?.year || 'N/A'}</div>
                                </div>
                                <div className="flex justify-between w-full text-[12px] md:text-[14px] 2xl:text-[16px]">
                                    <div className="list-item font-semibold ml-5">Edição</div>
                                    <div className="font-normal  text-[#636363] text-end">{book?.edition ? `${book?.edition}ª` : 'N/A'}</div>
                                </div>
                                <div className="flex justify-between w-full text-[12px] md:text-[14px] 2xl:text-[16px]">
                                    <div className="list-item font-semibold ml-5">Idioma</div>
                                    <div className="font-normal  text-[#636363] text-end">{book?.language || 'N/A'}</div>
                                </div>
                                <div className="flex justify-between w-full text-[12px] md:text-[14px] 2xl:text-[16px]">
                                    <div className="list-item font-semibold ml-5">ISBN</div>
                                    <div className="font-normal  text-[#636363] text-end">{formatISBN(book?.isbnCode) || 'N/A'}</div>
                                </div>
                                <div className="flex justify-between w-full text-[12px] md:text-[14px] 2xl:text-[16px]">
                                    <div className="list-item font-semibold ml-5">Idade indicada</div>
                                    <div className="font-normal  text-[#636363] text-end">{book?.indicatedAge || 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-[#FBB914] py-3 px-5 sm:px-7 md:px-14 xl:px-14 h-full mt-3">
                    <div className="text-white text-[25px] text-center md:text-start md:text-[30px] 2xl:text-[35px] font-medium">Avaliações</div>
                    {!reviews && (
                        <SkeletonTheme
                            borderRadius="0.5rem"
                            baseColor="#fdd264"
                            highlightColor="#fbb914"
                            duration={4}
                        >
                            <div className='h-full items-stretch flex flex-col'>
                                <Skeleton className='h-[100px] box-border p-3 mt-3 2xl:mt-6' width={'100%'} />
                            </div>
                        </SkeletonTheme>
                    )}
                    {reviews && reviews.length !== 0 ? (<div className={`transition-opacity duration-500 ${!reviews ? 'opacity-0 h-0' : 'flex flex-col gap-3 mt-2 sm:mt-3 2xl:mt-3 opacity-100 h-full'}`}>
                        {reviews.map((review, index) => <div key={index} className="border border-black rounded-xl p-3 block">
                            <div className="flex justify-between flex-wrap items-center gap-3">
                                <div className="flex flex-row flex-grow">
                                    {review?.picture.url ? (<div className="p-3 rounded-full bg-white"><img src={`${baseUrl}${review?.picture.url}`} alt="" className='object-contain h-[30px] w-[30px] md:h-[40px] md:w-[40px] lg:h-[50px] lg:w-[50px] sm:max-w-none 2xl:max-w-none 2xl:h-[60px] 2xl:w-[60px] rounded-full' /></div>)
                                        : (<div className="p-3 rounded-full bg-white"><FiUser color="#CFDA29" size={45} /></div>)}
                                    <div className="flex flex-col ml-3">
                                        <div className="flex-row flex items-center">{Array.from({ length: review.assessment }).map((_, index) => (<div key={index}><AiFillStar color="#D76B2A" size={20} /></div>))}</div>
                                        <div className="text-white text-[12px] md:text-[14px] 2xl:text-[16px]">{formatISODate(review.createdAt)}</div>
                                        <div className="font-semibold text-[12px] md:text-[14px] 2xl:text-[16px]">{review.evaluatorName}</div>
                                    </div>
                                </div>
                                <div className="flex-grow truncate text-start md:text-end text-[12px] md:text-[14px] 2xl:text-[16px] ">"{review.message}"</div>
                            </div>
                        </div>)}
                    </div>)
                        : <div className="py-3 text-white font-semibold text-center md:text-start text-[14px] md:text-[16px] 2xl:text-[20px] mt-1 md:mt-3">Nenhuma avaliação encontrada</div>
                    }
                </div>
            </div>
            {/* <div className="py-3 bg-[#FBB914] px-5 sm:px-7 md:px-14 xl:px-14 h-full">
                <div className="text-white text-[25px] text-center md:text-start md:text-[30px] 2xl:text-[35px] font-medium">Avaliações</div>
                {!reviews && (
                    <SkeletonTheme
                        borderRadius="0.5rem"
                        baseColor="#fdd264"
                        highlightColor="#fbb914"
                        duration={4}
                    >
                        <div className='h-full items-stretch flex flex-col'>
                            <Skeleton className='h-[100px] box-border p-3 mt-3 2xl:mt-6' width={'100%'} />
                        </div>
                    </SkeletonTheme>
                )}
                {reviews && reviews.length !== 0 && (<div className={`transition-opacity duration-500 ${!reviews ? 'opacity-0 h-0' : 'flex flex-col gap-3 mt-2 sm:mt-3 2xl:mt-3 opacity-100 h-full'}`}>
                    {reviews.map((review, index) => <div key={index} className="border border-black rounded-xl p-3 block">
                        <div className="flex justify-between flex-wrap items-center gap-3">
                            <div className="flex flex-row flex-grow">
                                {review?.picture.url ? (<div className="p-3 rounded-full bg-white"><img src={`${baseUrl}${review?.picture.url}`} alt="" className='object-contain h-[30px] w-[30px] md:h-[40px] md:w-[40px] lg:h-[50px] lg:w-[50px] sm:max-w-none 2xl:max-w-none 2xl:h-[60px] 2xl:w-[60px] rounded-full' /></div>)
                                    : (<div className="p-3 rounded-full bg-white"><FiUser color="#CFDA29" size={45} /></div>)}
                                <div className="flex flex-col ml-3">
                                    <div className="flex-row flex items-center">{Array.from({ length: review.assessment }).map((_, index) => (<div key={index}><AiFillStar color="#D76B2A" size={20} /></div>))}</div>
                                    <div className="text-white text-[12px] md:text-[14px] 2xl:text-[16px]">{formatISODate(review.createdAt)}</div>
                                    <div className="font-semibold text-[12px] md:text-[14px] 2xl:text-[16px]">{review.evaluatorName}</div>
                                </div>
                            </div>
                            <div className="flex-grow truncate text-start md:text-end text-[12px] md:text-[14px] 2xl:text-[16px] ">"{review.message}"</div>
                        </div>
                    </div>)}
                </div>)
                }
            </div> */}
        </>
    )
}