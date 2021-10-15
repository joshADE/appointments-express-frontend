import React from 'react'
import * as BiIcons from 'react-icons/bi'

interface RadioButtonProps {
    selected: string;
    value: string;
    onChange: (e: string) => void;
    className?: string;
    name: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({
    selected,
    value,
    onChange,
    className
}) => {




    return (
        <span className="relative">
            {value === selected? 
            <BiIcons.BiRadioCircleMarked 
                className={`inline-block text-gray-500 text-2xl cursor-pointer ${className}`}
                onClick={() => onChange(value)}
            /> : 
            <BiIcons.BiRadioCircle 
                className={`inline-block text-gray-500 text-2xl cursor-pointer ${className}`}
                onClick={() => onChange(value)}
            />}
        </span>
    );
}

export default RadioButton