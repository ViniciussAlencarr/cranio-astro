
// icons
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"

// utils
import { DepoimentImg01, DepoimentImg02, DepoimentImg03 } from "../../utils/getSvgIcons"
import { useEffect, useState } from "react";
import api from "../../api";

// types
interface Depoiment {
    id: string;
    value: string;
    evaluation: number;
}

interface Params {
    items: Depoiment[];
}

export const DepoimentsComponent = ({ }: Params) => {
    const [visibleSize, setVisibleSize] = useState(3);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [testimonials, setTestimonials] = useState([])

    const handleResize = () => {
        if (window.innerWidth < 600) {
            setVisibleSize(1);
        } else if (window.innerWidth < 900) {
            setVisibleSize(2);
        } else {
            setVisibleSize(3);
        }
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const getTestimonials = async () => {
            try {
                const { data } = await api.get('/testimonials')
                setTestimonials(data.data.map(({ id, attributes }: any) => ({ id, ...attributes })))
            } catch (err) {
                console.log(err)
            }
        }
        getTestimonials()
    }, [])

    const splitArray = (array: any[], size: number) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };

    const splitedTestimonials = splitArray(testimonials, visibleSize);

    const nextStep = () => {
        if (currentIndex < splitedTestimonials.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const previosStep = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div id="depoiments" className="mt-3 md:mt-6 2xl:mt-12 bg-[#FBB914] w-full">
            <div className="py-3 md:py-6 2xl:py-12 flex flex-col w-full">
                <div className="text-white text-center leading-9 text-[24px] sm:text-[27px] md:text-[35px] lg:text-[38px] 2xl:text-[40px] font-semibold">
                    Depoimentos
                </div>
                {splitedTestimonials.length !== 0 && splitedTestimonials[currentIndex] ? (
                    <div className="mt-3 flex justify-center items-center relative">
                        {currentIndex !== 0 && <div className="cursor-pointer absolute top-[50%] left-0 md:left-[4rem] 2xl:left-[4rem]">
                            <MdKeyboardArrowLeft onClick={previosStep} size={40} color="#D76B2A" />
                        </div>}
                        <div className="flex justify-center items-center lg:gap-2 2xl:gap-6">
                            {splitedTestimonials[currentIndex].map((testimonial, objIndex) => (
                                <div key={testimonial.id}>
                                    {objIndex === 0 && <div className="">
                                        <DepoimentImg01
                                            className="h-fit w-inherit max-w-[250px] sm:w-[320px] md:w-[282px] lg:w-[375px] sm:max-w-none 2xl:max-w-none 2xl:w-[566px]"
                                            depoiment={testimonial.value}
                                        />
                                    </div>}
                                    {objIndex === 1 && <div className="hidden sm:block">
                                        <DepoimentImg02
                                            className="h-fit w-inherit max-w-[110px] sm:w-[280px] md:w-[242px] lg:w-[295px] sm:max-w-none 2xl:max-w-none 2xl:w-[458px]"
                                            depoiment={testimonial.value}
                                        />
                                    </div>}
                                    {objIndex === 2 && <div className="hidden md:block">
                                        <DepoimentImg03
                                            className="h-fit w-inherit max-w-[110px] sm:w-[145px] md:w-[242px] lg:w-[295px] sm:max-w-none 2xl:max-w-none 2xl:w-[472px]"
                                            depoiment={testimonial.value}
                                        />
                                    </div>}
                                </div>
                            ))}
                        </div>
                        {currentIndex !== splitedTestimonials.length - 1 && <div className="cursor-pointer absolute top-[50%] right-0 md:right-[4rem] 2xl:right-[4rem]">
                            <MdKeyboardArrowRight onClick={nextStep} size={40} color="#D76B2A" />
                        </div>}
                    </div>)
                    : <div className="py-3 text-white font-semibold text-center text-[14px] md:text-[16px] 2xl:text-[20px] mt-1 md:mt-3">Nenhum depoimento encontrado</div>}
            </div>
        </div>
    )
}