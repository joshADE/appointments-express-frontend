import React from 'react'

interface InfoFormProps {
    id: string;
    label: string;
    name: string;
    type: 'text' | 'number' | 'select' | 'checkbox';
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
    options?: {label:string; value: any}[];
    isChecked: boolean;
}

const InfoForm: React.FC<InfoFormProps> = ({
    id,
    label,
    name,
    type,
    value,
    onChange,
    options,
    isChecked
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

export default InfoForm
