import React from 'react'

const TextareaCmp = ({ label, lableStyle, name, value, onChange, placeholder, style, ...otherProps }) => {

    return (
        <div>
            {label && <label htmlFor={name} className={lableStyle}>{label}</label>}
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`border border-gray-300 text-gray-400 rounded-md resize-none focus:outline-none focus:border-primary-700 ${style}`}
                {...otherProps}
            />
        </div>
    );
}

export default TextareaCmp