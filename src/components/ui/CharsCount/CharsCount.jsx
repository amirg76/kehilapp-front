import React from 'react'

const CharsCount = ({ currCount, total, style }) => {
    return (
        <span className={`text-sm ${style}`}>
          {total} / {currCount | 0}  
        </span>
    )
}

export default CharsCount