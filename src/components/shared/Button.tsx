import React from 'react'

interface ButtonProps {
    type: 'submit' | 'button' | 'reset';
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    type,
    onClick,
    disabled,
    className,
    children
}) => {
        return (<button
            type={type}
            disabled={disabled}
            className={`font-bold text-sm p-1 text-gray-700 bg-gray-300 disabled:opacity-80 focus:outline-none hover:text-gray-900 w-32 h-10 ${className}`}
            onClick={onClick}
        >{children}</button>);
}