import React from 'react'

const InputCmp = ({ type = 'text', label, labelStyle, name, value, onChange, placeholder, inputStyle, children, ...otherProps }) => {
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
                className={inputStyle}
                {...otherProps}
            />
            {children}
        </div>
    );
}

export default InputCmp