import React from 'react'
import CategoryIcon from '@components/ui/CategoryIcon/CategoryIcon'

const CategoryTag = ({ category }) => {

    const { color, title } = category
    return (
        <div className='h-[50px] relative left-[-17px] bottom-[15px]'>
            <div className='flex items-center justify-center relative top-[38px] text-center'>
            <CategoryIcon categoryTitle={title} color="white"/>
            <h6 className='font-semibold mr-2'>{title}</h6>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="106" height="69" viewBox="0 0 106 69" fill="none">
                <path d="M54.9591 47.641C25.3107 39.6967 -4.54148 54.9671 1.80278 31.29C8.14704 7.61291 37.3249 -5.14106 66.9734 2.80322C96.6218 10.7475 110.376 35.0052 104.032 58.6823C97.688 82.3594 84.6076 55.5852 54.9591 47.641Z" fill={color} />
            </svg>
        </div>
    )
}

export default CategoryTag