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
                className={style}
                {...otherProps}
            />
        </div>
    );
}

export default TextareaCmp