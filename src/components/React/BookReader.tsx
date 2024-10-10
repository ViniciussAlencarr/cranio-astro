import { useEffect, useRef, useState } from 'react'
import type { NavItem, Rendition } from 'epubjs'
import { ReactReader } from 'react-reader'
import useLocalStorageState from 'use-local-storage-state'
import api from '../../api';

// icons
import { GoArrowUp } from "react-icons/go";
import { GoArrowDown } from "react-icons/go";
import { RxLetterCaseUppercase } from "react-icons/rx";
import { RxLetterCaseLowercase } from "react-icons/rx";
import { FiPlusCircle } from "react-icons/fi";
import { GrSubtractCircle } from "react-icons/gr";

export const BookReader = ({ id = '', baseUrl = '' }) => {
    const toc = useRef<NavItem[]>([])

    const [page, setPage] = useState('')
    const [bookFilePath, setBookFilePath] = useState('')
    const [largeText, setLargeText] = useState(false)
    const rendition = useRef<Rendition | undefined>(undefined)

    const [location, setLocation] = useLocalStorageState<string | number>(
        'persist-location',
        {
            defaultValue: 0,
        }
    )

    useEffect(() => {
        if (!!id) {
            const getBookById = async () => {
                try {
                    const { data } = await api.get(`/books/${id}?populate=epubFile`)
                    setBookFilePath(data.data.attributes.epubFile.data.attributes.url)
                } catch (err) {
                    console.log(err)
                }
            }
            getBookById()
        }
    }, [id])

    useEffect(() => {
        rendition.current?.themes.fontSize(largeText ? '140%' : '100%')
    }, [largeText])

    const goToHome = () => window.location.href = window.location.origin
    const goToBookShelf = () => window.location.href = `${window.location.origin}/estante`
    // const goToBook = () => window.location.href = `${window.location.origin}/estante/detalhes?index=${}`

    return (
        <div className='p-6 md:p-7 md:pt-4 2xl:p-12 2xl:pt-6'>
            <div className='mb-6'>
                <div className='flex flex-row text-[12px] items-center gap-3 md:gap-6 2xl:gap-12'>
                    <div className='flex-grow gap-2 flex justify-end items-center'>
                        <div className='cursor-pointer hover:opacity-75 transition-all'><GrSubtractCircle className='w-[20px] md:w-[30px] h-[20px] md:h-[30px]' color='#CFDA29' /></div>
                        <div className='py-1 px-2 text-white font-semibold bg-[#5C5C5C] border border-black'>100%</div>
                        <div className='cursor-pointer hover:opacity-75 transition-all'><FiPlusCircle className='w-[20px] md:w-[30px] h-[20px] md:h-[30px]' color='#CFDA29' /></div>
                    </div>
                    <div className='flex gap-2 flex-grow items-center'>
                        <div className='cursor-pointer hover:opacity-75 transition-all'><GoArrowUp className='w-[20px] md:w-[30px] h-[20px] md:h-[30px]' color='#FBB914' /></div>
                        <div className='py-1 px-2 text-white font-semibold bg-[#5C5C5C] border border-black'>{page || 'N/A'}</div>
                        <div className='cursor-pointer hover:opacity-75 transition-all'><GoArrowDown className='w-[20px] md:w-[30px] h-[20px] md:h-[30px]' color='#FBB914' /></div>
                    </div>
                    <div className='items-center'>
                        <div onClick={() => setLargeText(!largeText)} className='cursor-pointer hover:opacity-75 transition-all'>{largeText ? <RxLetterCaseLowercase className='w-[20px] md:w-[30px] h-[20px] md:h-[30px]' color='#FBB914' /> : <RxLetterCaseUppercase className='w-[20px] md:w-[30px] h-[20px] md:h-[30px]' color='#FBB914' />}</div>
                    </div>
                </div>
            </div>
            <div className='rounded-lg scroll-smooth' style={{ height: '100vh' }}>
                <ReactReader
                    url={`${baseUrl}${bookFilePath}`}
                    swipeable
                    location={location}
                    epubOptions={{
                        allowScriptedContent: true
                    }}
                    epubInitOptions={{
                        openAs: 'epub',
                    }}
                    locationChanged={(loc: string) => {
                        setLocation(loc)
                        if (rendition.current && toc.current) {
                            const { displayed, href } = rendition.current.location.start
                            setPage(`${displayed.page}/${displayed.total}`)
                        }
                    }}
                    getRendition={(_rendition: Rendition) => {
                        rendition.current = _rendition
                        rendition.current.themes.fontSize(largeText ? '140%' : '100%')
                    }}
                />
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
    )
}