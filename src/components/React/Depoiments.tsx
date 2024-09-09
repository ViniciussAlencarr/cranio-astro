import { useEffect, useState } from "react";

// icons
import { MdKeyboardArrowRight } from "react-icons/md"

// utils
import { DepoimentImg01, DepoimentImg02, DepoimentImg03 } from "../../utils/getSvgIcons"


interface Depoiment {
    id: string;
    value: string;
    evaluation: number;
}

interface Params {
    items: Depoiment[];
}

const ITEMS_PER_PAGE = 1;

export const DepoimentsComponent = ({
    items
}: Params) => {
    const [currentPage, setCurrentPage] = useState(0);

    // Calcular o índice inicial e final dos itens para a página atual
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = items.slice(startIndex, endIndex);

    // Função para mudar a página
    const goToPage = (page: number) => {
        if (page >= 0 && page < Math.ceil(items.length / ITEMS_PER_PAGE)) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="mt-3 md:mt-6 2xl:mt-12 bg-[#FBB914] w-full">
            <div className="py-3 md:py-6 2xl:py-12 flex flex-col w-full">
                <div className="text-white text-center leading-9 text-[24px] sm:text-[27px] md:text-[35px] lg:text-[38px] 2xl:text-[40px] font-semibold">
                    Depoimentos
                </div>
                <div className="mt-3 flex justify-center items-center relative">
                    <div className="flex justify-center items-center lg:gap-2 2xl:gap-6">
                        <div className="">
                            <DepoimentImg01
                                className="h-fit w-inherit max-w-[250px] sm:w-[320px] md:w-[282px] lg:w-[375px] sm:max-w-none 2xl:max-w-none 2xl:w-[566px]"
                                depoiment={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi dictum lacus ut nulla mattis mattis. Vestibulum mi tortor, feugiat eget tincidunt venenatis, vulputate sit amet nunc. Quisque consequat facilisis nisi vitae finibus.`}
                            />
                        </div>
                        <div className="hidden sm:block">
                            <DepoimentImg02
                                className="h-fit w-inherit max-w-[110px] sm:w-[280px] md:w-[242px] lg:w-[295px] sm:max-w-none 2xl:max-w-none 2xl:w-[458px]"
                                depoiment={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi dictum lacus ut nulla mattis mattis. Vestibulum mi tortor, feugiat eget tincidunt venenatis, vulputate sit amet nunc. Quisque consequat facilisis nisi vitae finibus.`}
                            />
                        </div>
                        <div className="hidden md:block">
                            <DepoimentImg03
                                className="h-fit w-inherit max-w-[110px] sm:w-[145px] md:w-[242px] lg:w-[295px] sm:max-w-none 2xl:max-w-none 2xl:w-[472px]"
                                depoiment={`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi dictum lacus ut nulla mattis mattis. Vestibulum mi tortor, feugiat eget tincidunt venenatis, vulputate sit amet nunc. Quisque consequat facilisis nisi vitae finibus.`}
                            />
                        </div>
                    </div>
                    <div className="cursor-pointer absolute top-[50%] right-0 md:right-[4rem] 2xl:right-[4rem]">
                        <MdKeyboardArrowRight size={40} color="#D76B2A" />
                    </div>
                </div>
            </div>
        </div>
    )
}