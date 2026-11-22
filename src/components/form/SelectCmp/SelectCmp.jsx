import React from 'react'

const SelectCmp = ({ label, labelStyle, name, options, defaultOption, value, onChange, onBlur, style, containerStyle, ...otherProps }) => {

    return (
        <div className={containerStyle}>
            {label && <label htmlFor={name} className={labelStyle}>{label}</label>}
            {/* The arrow is positioned against this wrapper, not the container:
                with a label above the select, the container is taller than the
                select and the arrow would sit between the two. */}
            <div className="relative">
                <select id={name} name={name} value={value} onChange={onChange} onBlur={onBlur}
                    className={`appearance-none w-full bg-white dark:bg-slate-700 focus:shadow-outline border border-gray-300 dark:border-slate-600
                    px-3 py-2 rounded-md focus:outline-none focus:border-primary-700 dark:focus:border-primary-400
                    ${value ? 'text-gray-900 dark:text-slate-100' : 'text-gray-500 dark:text-slate-400'} ${style}`} {...otherProps}>
                    <option value="" onBlur={onBlur}>{defaultOption}</option>
                    {options.map((option) => (
                        <option key={option._id} value={option._id} onBlur={onBlur}>
                            {option.title}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700 dark:text-slate-300">
                    <svg
                        className="fill-current h-4 w-3   "
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                    >
                        <path d="M10 12l-6-6-1.4 1.4L10 15.8l7.4-7.4L16 6z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default SelectCmp
