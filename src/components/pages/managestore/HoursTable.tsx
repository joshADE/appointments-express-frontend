import React, { memo } from 'react'
import { StoreHours } from '../../../features/store/storeTypes';
import moment from 'moment';
import { TimeInput } from '../../shared/TimeInput';
import Checkbox from '../../shared/Checkbox';


interface HoursTableProps {
    hours: { [dayOfWeek: string]: Partial<StoreHours> };
    onChangeHours: (dayOfWeek: number, isOpenTime: boolean, newTime: string) => void
    onChangeOpenOrClose: (dayOfWeek: number, value: boolean) => void;
}


const HoursTable: React.FC<HoursTableProps> = ({
    hours,
    onChangeHours,
    onChangeOpenOrClose
}) => {
       
        const columns = [0, 1, 2, 3, 4, 5, 6];
        
        console.log('Rerendered HoursTable');

        

        return (
        <table className="font-montserrat text-xs font-normal table-auto border-collapse inline-block mt-2 pr-4">
            <thead>
                <tr>
                    <th key="-1">{' '}</th>
                    {columns.map(value => {
                        return (
                            <th key={value}>{moment(value,'d').format('ddd')}</th>
                        )
                    })}
                </tr>
            </thead>
            <tbody>
                <tr className="border-b border-gray-100">
                    <th key="isOpen-1">isOpen?</th>
                    {columns.map(value => {
                        return (
                            <td className="w-10 py-3" key={"isOpen" + value}>
                                <Checkbox
                                    checked={hours[value] && hours[value].isOpen !== undefined? hours[value].isOpen:false}
                                    onChange={(e) => onChangeOpenOrClose(value, e)}
                                    className="mx-3"
                                />
                            </td>
                        )
                    })}
                </tr>
                <tr className="border-b border-gray-100">
                    <th key="open-1">open</th>
                    {columns.map(value => {
                        return (
                            <td className="relative py-3" key={"open" + value}>
                                
                                <TimeInput 
                                    time={hours[value] && hours[value].open !== undefined? hours[value].open:"--:--:--"}
                                    disabled={!hours[value]?.isOpen}
                                    onChange={(e, v) => onChangeHours(value, true, moment(v, 'HH:mm').format('HH:mm:ss'))}
                                />

                            </td>
                        )
                    })}
                </tr>
                <tr>
                    <th key="close-1">close</th>
                    {columns.map(value => {
                        return (
                            <td className="relative py-3" key={"close" + value}>
                                <TimeInput 
                                    time={hours[value] && hours[value].close !== undefined? hours[value].close:"--:--:--"}
                                    disabled={!hours[value]?.isOpen}
                                    onChange={(e, v) => onChangeHours(value, false, moment(v, 'HH:mm').format('HH:mm:ss'))}
                                />
                            </td>
                        )
                    })}
                </tr>
            </tbody>
        </table>);
}

export default memo(HoursTable)