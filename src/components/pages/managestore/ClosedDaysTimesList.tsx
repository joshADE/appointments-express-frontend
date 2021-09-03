import React, { memo } from 'react'
import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';
import * as RiIcons from "react-icons/ri";
import { ClosedDaysTimes, RepeatInterval } from '../../../features/store/storeTypes';
import Checkbox from '../../shared/Checkbox';

interface ClosedDaysTimesListProps {
    closed: Partial<ClosedDaysTimes>[];
    onChangeFromOrTo: (index: number, isFrom: boolean, newVale: moment.Moment) => void;
    onChangeRepeat: (index: number, newValue: boolean) => void;
    onChangeRepeatInterval: (index: number, newValue: number) => void;
    addClosed: () => void;
    deleteClosed: (index: number) => void;
}

const intervals : { [label: string]: RepeatInterval } = {
    'Every Day Of The Week': RepeatInterval.everyDayOfWeek,
    'Current Day Of The Week': RepeatInterval.currentDayOfWeek,
    'Current Day Of The Month': RepeatInterval.currentDayOfMonth,
    'Current Day Of The Year': RepeatInterval.currentDayOfYear
};


const ClosedDaysTimesList: React.FC<ClosedDaysTimesListProps> = ({
    closed,
    onChangeFromOrTo,
    onChangeRepeat,
    onChangeRepeatInterval,
    addClosed,
    deleteClosed
}) => {
    console.log('Rerendered ClosedDaysTimesList');
        return (<div className="text-xs max-w-xs">
            <ul className="w-full">
                {closed.map((cdt, index) => {
                    return (
                        <li
                            key={index}
                            className={`${index !== closed.length - 1 ? 'border-b': ''} border-gray-700 mb-1 pb-1 w-full relative`}
                        >
                            <button type="button" onClick={() => deleteClosed(index)} className="font-normal text-gray-500 hover:text-gray-900 focus:outline-none absolute top-0 right-0" >
                                <RiIcons.RiDeleteBin6Line className="text-base" />
                            </button>
                            <div className="mb-2">
                                <label htmlFor="fromField">From: </label>
                                <Datetime 
                                    value={moment(cdt.from,'YYYY-MM-DD[T]HH:mm:ss')}
                                    onChange={e => onChangeFromOrTo(index, true, moment(e))}
                                    inputProps={{className:"border-b border-black"}}
                                />
                                {/* <input 
                                    className="border-b border-black focus:outline-none"
                                    id="fromField" 
                                    type="text"
                                    value={cdt.from}
                                /> */}
                            </div>
                            <div className="mb-2">
                                <label htmlFor="toField">To: </label>
                                <Datetime 
                                    value={moment(cdt.to,'YYYY-MM-DD[T]HH:mm:ss')}
                                    onChange={e => onChangeFromOrTo(index, false, moment(e))}
                                    inputProps={{className:"border-b border-black"}}
                                />
                                {/* <input 
                                    className="border-b border-black focus:outline-none"
                                    id="toField" 
                                    type="text"
                                    value={cdt.to}
                                /> */}
                            </div>
                            <div className="mb-2">
                                <label>Repeat: </label>
                                <Checkbox
                                    checked={cdt.repeat}
                                    onChange={e => onChangeRepeat(index, e)}
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="intervalField">Repeat Interval: </label>
                                <select
                                    id="intervalField"
                                    value={cdt.repeatInterval}
                                    disabled={!cdt.repeat}
                                    onChange={e => onChangeRepeatInterval(index, +e.target.value)}
                                    className="border-b border-black"
                                >
                                    {Object.entries(intervals).map(interval => <option key={interval[1]} value={interval[1]}>{interval[0]}</option>)}
                                </select>
                            </div>
                        </li>
                    )
                })}
            </ul>
            <button type="button" onClick={addClosed} className="border-t border-b w-full border-black">New closed day/time</button>
        </div>);
}

export default memo(ClosedDaysTimesList)