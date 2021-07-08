import React from 'react'

interface InfoFormElementProps {
    id: string;
    label: string;
    name: string;
    type: 'text' | 'number' | 'select' | 'checkbox';
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
    options?: {label:string; value: any}[];
    isChecked?: boolean;
    isRequired?: boolean;
}

const InfoFormElement: React.FC<InfoFormElementProps> = ({
    id,
    label,
    name,
    type,
    value,
    onChange,
    options,
    isChecked,
    isRequired
}) => {
    return (
        <div className="pt-5 text-xs">
            <label htmlFor={id}>{label}: </label>
            {(type === 'text' || type === 'number') &&
            <input 
                id={id}
                name={name}
                className="border-b border-black focus:outline-none"
                type={type}
                value={value}
                onChange={onChange}
                required={isRequired}
            />}
            {(type === 'select') &&
            <select
                id={id}
                name={name}
                className="border-b border-black focus:outline-none"
                value={value}
                onChange={onChange}>
                    {options && options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>}
            {(type === 'checkbox') &&
            <input
                id={id}
                name={name}
                className=""
                type="checkbox"
                checked={isChecked}
                onChange={onChange} 
            />}
        </div>
    )
}

export default InfoFormElement
