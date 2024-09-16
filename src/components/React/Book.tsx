import { useEffect, useState } from "react"
import api from "../../api"

// icons
import { AiFillStar } from "react-icons/ai"
import { CiCalendar } from "react-icons/ci"
import { HiOutlineDocument } from "react-icons/hi2"
import { ImBarcode } from "react-icons/im"
import { MdKeyboardArrowRight, MdOutlinePhonelinkRing } from "react-icons/md"
import { RiGroupLine } from "react-icons/ri"
import { TfiWorld } from "react-icons/tfi"

// utils
import { CoverBookImg } from "../../utils/getSvgIcons"

interface Book {
    id: string;
    authorName: string;
    createdAt: string;
    price: number;
    publishedAt: string;
    title: string;
    updatedAt: string;
    gender: string;
    edition: string;
    indicatedAge: string;
    isbnCode: string;
    language: string;
    pages: number;
    publisher: string;
    synopsis: string;
    year: number;
    ebook: boolean;
}

export const Book = ({ id = '' }) => {
    const [book, setBook] = useState<Book>()

    useEffect(() => {
        const getBookById = async () => {
            try {
                const { data } = await api.get(`/books/${id}`)
                setBook({ ...data.data.attributes, id: data.data.id })
            } catch (err) {
                console.log(err)
            }
        }
        getBookById()
    }, [])

    const formatPrice = (price: number) => price.toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' })

    const getPublishedYear = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.getFullYear();
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

    const addToCart = async () => {
        if (!book || Object.keys(book).length === 0) return;
        try {
            await api.post('/add-to-cart', {
                data: {
                    productId: JSON.stringify(book.id),
                    price: book.price,
                    bookAuthor: book.authorName,
                    bookTitle: book.title,
                    amount: 1
                }
            })
            window.location.href = `${window.location.origin}/carrinho/sacola`

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
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
                    <div>
                        <CoverBookImg
                            className="h-fit w-inherit max-w-[100px] sm:w-[180px] md:w-[210px] lg:w-[250px] sm:max-w-none 2xl:max-w-none 2xl:h-[368px] 2xl:w-[266px]" />
                    </div>
                    <div className="flex flex-col h-full items-baseline justify-start mt-3">
                        <div className="block w-full">
                            <div className="flex items-center justify-start">
                                {
                                    Array.from({ length: 5 }).map((_, index) => (
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
                            className="text-[#CFDA29] text-[24px] sm:text-[27px] md:text-[35px] lg:text-[38px] 2xl:text-[40px] font-semibold">
                            {formatPrice(book?.price || 0)}
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
                        <div className="mt-1 md:mt-3 2xl:mt-6 block w-full">
                            <div className="flex flex-col sm:flex-row 2xl:flex-row items-start">
                                <div>
                                    <button onClick={() => addToCart()}
                                        className="bg-[#CFDA29] rounded-full py-1 px-3 md:py-2 md:px-12 2xl:py-2 2xl:px-12 text-white font-semibold hover:opacity-70 text-[10px] sm:text-[12px] md:text-[14px] 2xl:text-[16px]">Adicionar
                                        carrinho</button>
                                </div>
                                <div className="ml-0 mt-2 sm:mt-0 sm:ml-2 2xl:mt-0 2xl:ml-3">
                                    <button
                                        className="bg-[#EE8A21] rounded-full py-1 px-3 md:py-2 md:px-12 2xl:py-2 2xl:px-12 text-white font-semibold hover:opacity-70 text-[10px] sm:text-[12px] md:text-[14px] 2xl:text-[16px]">Comprar
                                        agora</button>
                                </div>
                            </div>
                        </div>
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
        </>
    )
}