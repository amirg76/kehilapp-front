import React from 'react'

const CharsCount = ({ currCount, total, style }) => {
    return (
        <span className={`text-sm text-gray-600 dark:text-slate-300 ${style}`}>
          {total} / {currCount | 0}  
        </span>
    )
}

export default CharsCount