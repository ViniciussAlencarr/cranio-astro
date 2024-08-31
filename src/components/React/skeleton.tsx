import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

import 'react-loading-skeleton/dist/skeleton.css'

export const SeeFlowsSkeleton = () => {
    return (
        <SkeletonTheme
            borderRadius="0.5rem"
            duration={4}
        >
            <div className='h-full items-stretch flex flex-col'>
                <Skeleton className='w-[20px] h-[60px]' />
                <Skeleton className='h-[50svh] box-border my-6 md:my-8 2xl:my-11' width={'100%'} />
            </div>
        </SkeletonTheme>
    )
}