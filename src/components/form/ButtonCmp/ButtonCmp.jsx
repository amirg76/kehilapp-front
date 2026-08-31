import React from 'react'

const ButtonCmp = ({ label, onClick, isDisabled, style, ...otherProps }) => {

    return (
        <button onClick={onClick} disabled={isDisabled}
            className={`bg-primary-700 hover:bg-primary-600 active:bg-primary-800 text-white text-lg
        font-medium rounded-md transition-colors flex items-center justify-center
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
        focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-800
        ${style} ${isDisabled && 'opacity-50'}`} {...otherProps}>
            {label}
        </button>
    );
}

export default ButtonCmp