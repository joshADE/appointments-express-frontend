import React from 'react'
import * as MdIcons from 'react-icons/md'

interface CheckboxProps {
    checked?: boolean;
    onChange: (e: boolean) => void;
    className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
    checked,
    onChange,
    className
}) => {


    return (
        <span className="relative">
            {checked? 
            <MdIcons.MdCheckBox 
                className={`inline-block text-gray-500 text-lg ${className}`}
                onClick={() => onChange(!checked)}
            /> : 
            <MdIcons.MdCheckBoxOutlineBlank 
                className={`inline-block text-gray-500 text-lg ${className}`}
                onClick={() => onChange(!checked)}
            />}
        </span>
    );
}

export default Checkbox