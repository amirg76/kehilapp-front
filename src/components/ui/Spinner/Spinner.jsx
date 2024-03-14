import React from 'react'

const Spinner = ({ style }) => {
    return (
        <div className={`inline-block animate-spin rounded-full border-4 border-solid border-current 
    border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${style}`}
            role="status"></div>
    )
}

export default Spinner