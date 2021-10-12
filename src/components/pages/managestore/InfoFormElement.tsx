import React from 'react'
import Checkbox from '../../shared/Checkbox';

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
    showOverrideOption: boolean;
    overrideChecked: boolean;
    onOverrideCheckedChanged: (e: boolean) => void;
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
    isRequired,
    showOverrideOption,
    overrideChecked,
    onOverrideCheckedChanged
}) => {
    return (
      <div className="pt-2 text-xs">
        <label className="block text-gray-800" htmlFor={id}>{label}: </label>
        {(type === "text" || type === "number") && (
          <input
            id={id}
            name={name}
            className="border border-gray-400 p-0.5 text-gray-700 rounded focus:outline-none focus:border-green-700"
            type={type}
            value={value}
            onChange={onChange}
            required={isRequired}
          />
        )}
        {type === "select" && (
          <select
            id={id}
            name={name}
            className="border border-gray-400 p-0.5 text-gray-700 rounded focus:outline-none focus:border-green-700"
            value={value}
            onChange={onChange}
          >
            {options &&
              options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
          </select>
        )}
        {type === "checkbox" && (
          <input
            id={id}
            name={name}
            className=""
            type="checkbox"
            checked={isChecked}
            onChange={onChange}
          />
        )}
        {showOverrideOption && (
          <div className="inline-block ml-1">
            {" "}
            <Checkbox checked={overrideChecked} onChange={onOverrideCheckedChanged} />
          </div>
        )}
      </div>
    );
}

export default InfoFormElement
