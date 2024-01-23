import React from 'react'

const ErrorMessage = ({ msg, style }) => {

    if (!msg || !msg.length) return <div></div>
    return (
        <div className={`text-red ${style}`}>
            {msg}
        </div>
    )
}

export default ErrorMessage