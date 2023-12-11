import React from 'react'

const CategoryIcon = ({ categoryTitle }) => {
    switch (categoryTitle) {
        case 'חינוך':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="15" viewBox="0 0 21 15" fill="none">
                    <path d="M19.5003 4.53381L10.3337 0.867142L1.16699 4.53381L10.3337 8.20047L19.5003 4.53381ZM19.5003 4.53381V10.0338" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M4.83398 6.00047V10.9505C4.83398 11.6798 5.41345 12.3793 6.4449 12.895C7.47635 13.4107 8.87529 13.7005 10.334 13.7005C11.7927 13.7005 13.1916 13.4107 14.2231 12.895C15.2545 12.3793 15.834 11.6798 15.834 10.9505V6.00047" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            )
        default:
            break;
    }
}

export default CategoryIcon