import React from 'react'

interface SelectProps<T> {
    options: { label:string; value: T }[];
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    value?: T;
}

const Select: React.FC<SelectProps<any>> = ({
    options,
    onChange,
    value
}) => {
        return (
        <select
            onChange={onChange}
            className="border border-gray-400 p-0.5 text-gray-700 rounded focus:outline-none focus:border-green-700"
            value={value}
        >
            {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        );
}

export default Select