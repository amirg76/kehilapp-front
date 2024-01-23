import React from 'react'

const SelectCmp = ({ label, labelStyle, name, options, defaultOption, value, onChange, onBlur, style, containerStyle, ...otherProps }) => {

    return (
        <div className={containerStyle}>
            {label && <label htmlFor={name} className={labelStyle}>{label}</label>}
            <select name={name} value={value} onChange={onChange} onBlur={onBlur} className={`appearance-none w-full bg-white focus:shadow-outline border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-primary-700 ${!value && 'text-gray-400'} ${style}`} {...otherProps}>
                <option value="" onBlur={onBlur}>{defaultOption}</option>
                {options.map((option) => (
                    <option key={option._id} value={option._id} onBlur={onBlur}>
                        {option.title}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700">
                {/* <!-- Arrow icon or styling can be added here --> */}
                <svg
                    className="fill-current h-4 w-3   "
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                >
                    <path d="M10 12l-6-6-1.4 1.4L10 15.8l7.4-7.4L16 6z" />
                </svg>
            </div>
        </div>
    );
}

export default SelectCmp