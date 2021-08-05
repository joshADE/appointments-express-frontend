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
            className="focus:outline-none border-b border-black text-gray-500"
            value={value}
        >
            {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        );
}

export default Select