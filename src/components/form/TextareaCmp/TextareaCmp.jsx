import React from 'react'

const TextareaCmp = ({ label, labelStyle, name, value, onChange, placeholder, style, ...otherProps }) => {

    return (
        <div>
            {label && <label htmlFor={name} className={labelStyle}>{label}</label>}
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`border border-gray-300 rounded-md resize-none focus:outline-none focus:border-primary-700 ${style}`}
                {...otherProps}
            />
        </div>
    );
}

export default TextareaCmp