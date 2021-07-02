import React, { useState, useEffect, useRef, memo } from 'react'
import { StoreHours } from '../../../features/store/storeTypes';
import moment from 'moment';


interface HoursTableProps {
    hours: { [dayOfWeek: string]: Partial<StoreHours> };
    onIncrementOrDecrement: (dayOfWeek: number, isOpenTime: boolean, amountMinutes: number) => void;
    onChangeOpenOrClose: (dayOfWeek: number, value: boolean) => void;
}

interface FocusedInputDetail {
    for: 'open' | 'close';
    value: number;
}

const HoursTable: React.FC<HoursTableProps> = ({
    hours,
    onIncrementOrDecrement,
    onChangeOpenOrClose
}) => {
        const [focusedInput, setFocusedInput] = useState<FocusedInputDetail>({for:'open', value: 7});
        const tableRef = useRef<HTMLTableElement>(null);
        const columns = [0, 1, 2, 3, 4, 5, 6];
        

        useEffect(() => {
            const eventListener = (e: MouseEvent) => { 
                if (tableRef.current && !tableRef.current.contains(e.target as Node))
                    setFocusedInput({for:'open', value: 7});
            }
            document.addEventListener('mousedown', eventListener);
            return () => { document.removeEventListener('mousedown', eventListener); }
        },[])

        return (
        <table className="font-roboto text-xs font-normal table-auto border-collapse" ref={tableRef}>
            <thead>
                <tr>
                    <th className="border border-gray-300" key="-1">{' '}</th>
                    {columns.map(value => {
                        return (
                            <th className="border border-gray-300" key={value}>{moment(value,'d').format('ddd')}</th>
                        )
                    })}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th className="border border-gray-300" key="isOpen-1">isOpen?</th>
                    {columns.map(value => {
                        return (
                            <td className="border border-gray-300 w-20" key={"isOpen" + value}>
                                <input 
                                    type="checkbox"
                                    name={"isOpen" + value}
                                    checked={hours[value] && hours[value].isOpen !== undefined? hours[value].isOpen:false}
                                    onChange={(e) => onChangeOpenOrClose(value, e.target.checked)}
                                    className="mx-8"
                                />
                            </td>
                        )
                    })}
                </tr>
                <tr>
                    <th className="border border-gray-300" key="open-1">open</th>
                    {columns.map(value => {
                        return (
                            <td className="border border-gray-300 relative" key={"open" + value}>
                                {(focusedInput.for === 'open' && focusedInput.value === value) && <>
                                <button onClick={() => onIncrementOrDecrement(value, true, 5)} type="button" className="focus:outline-none bg-blue-300 ring-2 ring-blue-500 z-10 rounded-sm text-gray-700 p-0 w-1/2 h-4 left-1/4 absolute -top-3/4">+</button>
                                <button onClick={() => onIncrementOrDecrement(value, true, -5)} type="button" className="focus:outline-none bg-blue-300 ring-2 ring-blue-500 z-10 rounded-sm text-gray-700 p-0 w-1/2 h-4 left-1/4 absolute top-full">-</button>
                                </>}
                                <input 
                                    type="text" 
                                    value={hours[value] && hours[value].open !== undefined? hours[value].open:"--:--:--"}
                                    readOnly
                                    disabled={!hours[value]?.isOpen}
                                    onFocus={(e) => { setFocusedInput({ for: 'open', value}); }}
                                    className="w-full text-center border border-transparent focus:outline-none"
                                />
                            </td>
                        )
                    })}
                </tr>
                <tr>
                    <th className="border border-gray-300" key="close-1">close</th>
                    {columns.map(value => {
                        return (
                            <td className="border border-gray-300 relative" key={"close" + value}>
                                {(focusedInput.for === 'close' && focusedInput.value === value) && <>
                                <button onClick={() => onIncrementOrDecrement(value, false, 5)} type="button" className="focus:outline-none bg-blue-300 ring-2 ring-blue-500 z-10 rounded-sm text-gray-700 p-0 w-1/2 h-4 left-1/4 absolute -top-3/4">+</button>
                                <button onClick={() => onIncrementOrDecrement(value, false, -5)} type="button" className="focus:outline-none bg-blue-300 ring-2 ring-blue-500 z-10 rounded-sm text-gray-700 p-0 w-1/2 h-4 left-1/4 absolute top-full">-</button>
                                </>}
                                <input 
                                    type="text" 
                                    value={hours[value] && hours[value].close !== undefined? hours[value].close:"--:--:--"}
                                    readOnly
                                    disabled={!hours[value]?.isOpen}
                                    onFocus={(e) => { setFocusedInput({ for: 'close', value}); }}
                                    className="w-full text-center border border-transparent focus:outline-none"
                                />
                            </td>
                        )
                    })}
                </tr>
            </tbody>
        </table>);
}

export default memo(HoursTable)