import { useEffect, useRef, useState } from 'react'
import useLocalStorageState from 'use-local-storage-state'
import api from '../../api';

// icons
import { GoArrowUp } from "react-icons/go";
import { GoArrowDown } from "react-icons/go";
import { RxLetterCaseLowercase, RxLetterCaseUppercase } from "react-icons/rx";
import { FiPlusCircle } from "react-icons/fi";
import { GrSubtractCircle } from "react-icons/gr";

export const BookReader = ({ id = '', baseUrl = '', bookReaderUrl = '' }) => {
    const [page, setPage] = useState('')
    const [bookFilePath, setBookFilePath] = useState('')
    const [largeText, setLargeText] = useState(false)

    const [location, setLocation] = useLocalStorageState<string | number>(
        'persist-location',
        {
            defaultValue: 0,
        }
    )

    useEffect(() => {
        console.log()
        if (!!id) {
            const getBookById = async () => {
                try {
                    const { data } = await api.get(`/books/${id}?populate=epubFile`)
                    setBookFilePath(data.epubFile.url)
                } catch (err) {
                    console.log(err)
                }
            }
            getBookById()
        }
    }, [id])


    const goToHome = () => window.location.href = window.location.origin
    const goToBookShelf = () => window.location.href = `${window.location.origin}/estante`
    // const goToBook = () => window.location.href = `${window.location.origin}/estante/detalhes?index=${}`

    return (
        <div className='p-6 md:p-7 md:pt-4 2xl:p-12 2xl:pt-6'>
            <div className='flex flex-col h-screen'>

            <div className='h-full w-full'>
                <iframe className='w-full h-full' src={`${bookReaderUrl}?path=${bookFilePath}`} ></iframe>
            </div>
            <div className='items-center justify-evenly gap-6 sm:gap-0 flex-wrap flex flex-row mt-6'>
                <div className='flex-grow sm:flex-grow-0'>
                    <button onClick={goToHome} className="bg-[#EE8A21] w-full text-white font-medium hover:opacity-70 rounded-full py-2 px-6 sm:px-12 text-[14px] md:text-[16px]">Tela inicial</button>
                </div>
                <div className='flex-grow sm:flex-grow-0'>
                    <button onClick={goToBookShelf} className="bg-[#EE8A21] w-full text-white font-medium hover:opacity-70 rounded-full py-2 px-6 text-[14px] md:text-[16px]">Estante</button>
                </div>
                <div className='flex-grow sm:flex-grow-0'>
                    <button className="bg-[#EE8A21] w-full text-white font-medium hover:opacity-70 rounded-full py-2 px-6 text-[14px] md:text-[16px]">Livro atual</button>
                </div>
            </div>
            </div>
        </div>
    )
}