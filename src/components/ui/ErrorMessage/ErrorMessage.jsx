import React from 'react'

const ErrorMessage = ({ msg, style }) => {

    return (
        <div className={`text-red-600 text-sm ${style}`}>
            {msg && msg.length && <span>{msg}</span>}
        </div>
    )
}

export default ErrorMessage