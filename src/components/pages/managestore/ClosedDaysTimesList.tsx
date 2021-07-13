import React, { memo } from 'react'
import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';
import * as MdIcons from 'react-icons/md'
import { ClosedDaysTimes, RepeatInterval } from '../../../features/store/storeTypes';

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
        return (<div className="text-xs w-full">
            <ul className="w-full">
                {closed.map((cdt, index) => {
                    return (
                        <li
                            key={index}
                            className="border border-gray-700 mb-1 w-full relative"
                        >
                            <button type="button" onClick={() => deleteClosed(index)} className="font-normal text-gray-500 hover:text-gray-900 focus:outline-none absolute top-0 right-0" >
                                <MdIcons.MdDelete className="text-lg" />
                            </button>
                            <div>
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
                            <div>
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
                            <div>
                                <label htmlFor="repeatField">Repeat: </label>
                                <input 
                                    id="repeatField" 
                                    type="checkbox"
                                    checked={cdt.repeat}
                                    onChange={e => onChangeRepeat(index, e.target.checked)}
                                />
                            </div>
                            <div>
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
            <button type="button" onClick={addClosed} className="border w-full border-black">New closed day/time</button>
        </div>);
}

export default memo(ClosedDaysTimesList)