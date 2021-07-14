import React from 'react'
import TimeField from 'react-simple-timefield';

interface TimeInputProps {
    time?: string;
    disabled: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>, value: string) => void
}

export const TimeInput: React.FC<TimeInputProps> = ({
    time,
    disabled,
    onChange
}) => {

    return (<span>
        <TimeField 
            value={time}
            onChange={onChange}
            input={<input type="text" className="font-light rounded w-10 text-center" disabled={disabled} />}
        />
    </span>);
}