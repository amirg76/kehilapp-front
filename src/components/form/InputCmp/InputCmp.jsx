import React from 'react'

const InputCmp = ({ type = 'text', label, lableStyle, name, value, onChange, placeholder, inputStyle, ...otherProps }) => {

    return (
        <div>
            {label && <label htmlFor={name} className={lableStyle}>{label}</label>}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={inputStyle}
                {...otherProps}
            />
        </div>
    );
}

export default InputCmp