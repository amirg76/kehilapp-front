import React from 'react'

const InputCmp = ({ type = 'text', label, labelStyle, name, value, onChange, placeholder, onBlur, inputStyle, children, ...otherProps }) => {
    const { containerStyle, onContainerClick } = otherProps

    return (
        <div className={containerStyle} onClick={onContainerClick}>
            {label && <label htmlFor={name} className={labelStyle}>{label}</label>}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`border border-gray-300 text-gray-400 px-3 py-2 rounded-md focus:outline-none focus:border-primary-700 ${inputStyle}`}
                onBlur={onBlur}
                {...otherProps}
            />
            {children}
        </div>
    );
}

export default InputCmp