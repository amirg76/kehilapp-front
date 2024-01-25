import React, { Children } from 'react'

const TextareaCmp = ({ label, labelStyle, name, value, onChange, placeholder, style, maxLength, rows, children, ...otherProps }) => {

    const { containerStyle } = otherProps

    return (
        <div className={`mb-3 ${containerStyle}`}>
            {label && <label htmlFor={name} className={labelStyle}>{label}</label>}
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`border border-gray-300 rounded-md resize-none focus:outline-none focus:border-primary-700 ${style}`}
                maxLength={maxLength}
                rows={rows}
                {...otherProps}
            />
            {children}
        </div>
    );
}

export default TextareaCmp