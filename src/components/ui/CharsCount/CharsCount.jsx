import React from 'react'

const CharsCount = ({ currCount, total, style }) => {
    return (
        <div className={style}>
            {currCount} / {total}
        </div>
    )
}

export default CharsCount