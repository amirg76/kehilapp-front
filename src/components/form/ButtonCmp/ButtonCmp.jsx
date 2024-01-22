import React from 'react'

const ButtonCmp = ({ label, onClick, style, ...otherProps }) => {

    return (
        <button onClick={onClick} className={style} {...otherProps}>
            {label}
        </button>
    );
}

export default ButtonCmp