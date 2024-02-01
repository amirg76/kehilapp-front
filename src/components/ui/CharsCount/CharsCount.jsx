import React from 'react'

const CharsCount = ({ currCount, total, style }) => {
    // console.log(currCount, total);
    return (
        <span className={`text-sm ${style}`}>
          {total} / {currCount | 0}  
        </span>
    )
}

export default CharsCount