import React from 'react'

interface ButtonProps {
    type: 'submit' | 'button' | 'reset';
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    outline?: boolean;
    bare?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    type,
    onClick,
    disabled,
    className,
    children,
    outline,
    bare
}) => {
        return (<button
            type={type}
            disabled={disabled}
            className={`font-bold text-sm p-1 rounded-lg ${!bare && (!!outline ? 'border border-gray-300' : 'bg-gray-300')} disabled:opacity-80 focus:outline-none w-32 h-10 ${className}`}
            onClick={onClick}
        >{children}</button>);
}