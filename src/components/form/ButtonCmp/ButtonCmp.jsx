import React from 'react'

const ButtonCmp = ({ label, onClick, isDisabled, style, ...otherProps }) => {

    return (
        <button onClick={onClick} disabled={isDisabled} 
        className={`bg-primary-700 hover:bg-primary-600 active:bg-primary-800 text-white text-lg font-medium rounded-md focus:outline-none ${style} ${isDisabled && 'opacity-50'}`} {...otherProps}>
            {label}
        </button>
    );
}

export default ButtonCmp